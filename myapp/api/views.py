import dataclasses
from grpc import Status
from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework import status
from rest_framework import authentication, permissions
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

import numpy as np
import pandas as pd
from myapp.api.models import Story
from myapp.api.models import Entry

from tensorflow import keras
from keras.preprocessing.text import Tokenizer
from keras.utils import pad_sequences

import csv

class CalculateEffort(APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def tokenizer_helper(self, input_sentences):
        # Tokenizer, padding, etc.
        print("Training sentences")
        print(input_sentences)
        tokenizer = Tokenizer(num_words=10000, oov_token="<OOV>")
        tokenizer.fit_on_texts(input_sentences)
        input_sequences = tokenizer.texts_to_sequences(input_sentences)
        training_padded = pad_sequences(input_sequences, padding='post', truncating='post', maxlen=150)


        # Esto se manda a la funcion de predict del modelo
        training_padded = np.array(training_padded)
        #with open("myapp/api/model.json") as file:
        #    dict_config = json.load(file)
        #json_object = json.dumps(dict_config["modelTopology"]["model_config"])
        model = keras.models.load_model("myapp/api/effort_model.h5")
        #print(model.summary())
        #print(model.to_json())
        predictions = model.predict(training_padded)
        print(predictions)
        return predictions


    def post(self, request, format=None):
        try:
            submittionName = request.data['damName']
        except Exception as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)
        else: 
            if submittionName == "formSubmit":
                try:
                    #print("Something")
                    #print(request.data)
                    issue_key= request.data['IssueKey']
                    severity = request.data['Severity']
                    priority = request.data['Priority']
                    summ = request.data['Summary']
                    des = request.data['Description']
                    input_sentences = [severity + " " + priority + " " + summ + " " + des]
                    predictions = self.tokenizer_helper(input_sentences)
                    predictions[0][0] = int(predictions[0][0])
                except Exception as e:
                    reason_for_exception = {"Error": "The inputs in your CSV seem to be badly formated and can't be tokenized. " + str(e)}
                    return Response(reason_for_exception, status=status.HTTP_400_BAD_REQUEST)
                else:
                    new_entry = Entry(user=request.user) 
                    new_entry.save()
                    new_story = Story(issue_key=issue_key, severity=severity, priority=priority, summary=summ, description=des, days_of_work=predictions[0][0], entry=new_entry)
                    new_story.save()
                    return Response({'Prediction': predictions})
            elif submittionName == "csvSubmit":
                try:
                    #if submittionName == "formSubmit":
                        #print("Form")
                    #elif submittionName == "csvSubmit":
                    file = request.FILES['dataFile'].temporary_file_path()
                    #utf8_file = codecs.EncodedFile(request.FILES['dataFile'].open(),"utf-8")
                    #print(file)
                    #print(type(file))
                    #file = data.read().decode('utf-8')
                    #reader = csv.DictReader(io.StringIO(file))
                    #print(reader)
                    #print(type(reader))
                    ###########
                    # Se lee el archivo csv
                    df = pd.read_csv(file)
                    #print(df)
                    df = df.dropna()
                    df = df.reset_index(drop=True)
                except Exception as e:
                    reason_for_exception = {"Error": "The format of your file seems to be incorrect. " + str(e)}
                    return Response(reason_for_exception, status=status.HTTP_400_BAD_REQUEST)
                else:
                    try:
                        string=""
                        # Se agregan las columnas en arrays de string 

                        words = []
                        for i in range(len(df)):
                            severity = df.loc[i,'Severity']
                            priority = df.loc[i,'Priority']
                            summ = df.loc[i,'Summary']
                            des = df.loc[i,"Description"]
                            string += severity
                            string += " "
                            string += priority
                            string += " "
                            string += summ
                            string += " "
                            string += des
                            words.append(string)
                            string = ""

                        input_sentences = words
                    except Exception as e:
                        reason_for_exception = {"Error": "Your CSV seems to have incorrect column names. " + str(e)}
                        return Response(reason_for_exception, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        try:
                            predictions = self.tokenizer_helper(input_sentences)
                            #Stiching predictions to the dataframe of the csv
                            arr = np.concatenate(predictions, axis=0)
                            df['Days of Work'] = arr
                            df['Days of Work'] = df['Days of Work'].astype(int)
                        except Exception as e:
                            reason_for_exception = {"Error": "The inputs in your CSV seem to be badly formated and can't be tokenized. " + str(e)}
                            return Response(reason_for_exception, status=status.HTTP_400_BAD_REQUEST)
                        else:    
                            #Sending the csv to the frontend
                            new_entry = Entry(name=request.data['fileName'], user=request.user)
                            new_entry.save()
                            new_stories = df.to_dict('records')
                            for row in new_stories:
                                new_story = Story(issue_key=row['Issue key'], severity=row['Severity'], priority=row['Priority'], summary=row['Summary'], description=row['Description'], days_of_work=float(row['Days of Work']), entry=new_entry)
                                new_story.save()
                            csvResponse = HttpResponse(content_type="text/csv", headers={'Content-Disposition': 'attachment; filename="result.csv"'},)
                            df.to_csv(path_or_buf=csvResponse, index=False)
                            return csvResponse
            else:
                content = {'Error': 'Datatype is unsuported.'}
                return Response(content, status=status.HTTP_400_BAD_REQUEST)  

class RequestHistoryEntries(APIView):    
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        entries_list = []
        entries = Entry.objects.filter(user=request.user).order_by('-estimation_date')
        if entries.count() > 0:
            for e in entries:
                if e.name == "Form":
                    form_story = Story.objects.get(entry_id=e.id)
                    story_dict = {
                        'issue_key': form_story.issue_key,
                        'severity': form_story.severity,
                        'priority': form_story.priority,
                        'summary': form_story.summary,
                        'description': form_story.description,
                        'days_of_work': str(form_story.days_of_work)
                    }
                else:
                    story_dict = {
                        'issue_key': "N/A",
                        'severity': "N/A",
                        'priority': "N/A",
                        'summary': "N/A",
                        'description': "N/A",
                        'days_of_work': "N/A"
                    }
                entry = {
                    'id': e.id,
                    'name': e.name,
                    'estimation_date': e.estimation_date.strftime('%b %d, %Y'),
                    'user_id': e.user_id,
                }
                entry.update(story_dict)
                entries_list.append(entry)
            return Response({'profiles': entries_list})
        else:
            reason_for_exception = {"Error": "There is no history for this user."}
            return Response(reason_for_exception, status=status.HTTP_404_NOT_FOUND)


class RequestEntryStories(APIView):    
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request, entry_id):
        try:
            Entry.objects.filter(id=entry_id, user=request.user).get()
        except Entry.DoesNotExist:
            reason_for_exception = {"Error": "Not authorized to access another user's information."}
            return Response(reason_for_exception, status=status.HTTP_401_UNAUTHORIZED)
        else:
            stories = Story.objects.filter(entry_id=entry_id)
            if stories.count() > 0:
                response = HttpResponse(content_type="text/csv", headers={'Content-Disposition': 'attachment; filename="result.csv"'})
                writer = csv.writer(response)
                writer.writerow(['Issue Key', 'Severity', 'Priority', 'Summary', 'Description', 'Days of Work'])
                for story in stories.values_list('issue_key', 'severity', 'priority', 'summary', 'description', 'days_of_work'):
                    writer.writerow(story)
                return response
            else:
                reason_for_exception = {"Error": "No entries have been found for this user and with this id."}
                return Response(reason_for_exception, status=status.HTTP_404_NOT_FOUND)

class RequestUser(APIView):

    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        user = request.user
        message = {
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined.strftime('%b %d, %Y'),
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_superuser': user.is_superuser
        }
        return Response({'Profile': message})