from xml.dom import ValidationErr
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView, PasswordChangeDoneView, PasswordResetView, PasswordResetConfirmView, PasswordResetDoneView, PasswordResetCompleteView
from rest_framework.views import APIView
from rest_framework import authentication, permissions
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.debug import sensitive_post_parameters
from django.views.decorators.cache import never_cache
import json

class SpaView(LoginRequiredMixin, TemplateView):
    template_name = "spa/index.html"


class CustomLoginView(LoginView):

    @method_decorator(sensitive_post_parameters())
    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def form_invalid(self, form):
        temp_response = self.render_to_response(self.get_context_data(form=form))
        my_string = json.dumps(form.errors)
        #my_data = json.loads(my_string)
        print(my_string)
        print(type(my_string))
        temp_response.content = my_string
        return temp_response

class CustomLogoutView(LogoutView):
    #Inheriting the LogoutView
    pass

class CustomPasswordChangeView(PasswordChangeView):
    #Inheriting the PasswordChangeView
    template_name = "registration/password_change.html"
    def form_invalid(self, form):
        temp_response = self.render_to_response(self.get_context_data(form=form))
        my_string = json.dumps(form.errors)
        #my_data = json.loads(my_string)
        print(my_string)
        print(type(my_string))
        temp_response.content = my_string
        return temp_response

class CustomPasswordChangeDoneView(PasswordChangeDoneView):
    template_name = "registration/password_change_done_spa.html" 

class CustomPasswordResetView(PasswordResetView):
    #Inheriting the PasswordChangeView
    template_name = "registration/password_reset_spa.html"
    def form_invalid(self, form):
        temp_response = self.render_to_response(self.get_context_data(form=form))
        my_string = json.dumps(form.errors)
        #my_data = json.loads(my_string)
        print(my_string)
        print(type(my_string))
        temp_response.content = my_string
        return temp_response

class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    #Inheriting the PasswordChangeConfirmView
    template_name = "registration/reset_set_password_spa.html"
    def form_invalid(self, form):
        temp_response = self.render_to_response(self.get_context_data(form=form))
        my_string = json.dumps(form.errors)
        #my_data = json.loads(my_string)
        print(my_string)
        print(type(my_string))
        temp_response.content = my_string
        return temp_response

class CustomPasswordResetDoneView(PasswordResetDoneView):
    #Inheriting the PasswordChangeDoneView
    template_name = "registration/password_reset_done_spa.html"
    pass

class CustomPasswordResetCompleteView(PasswordResetCompleteView):
    template_name = "registration/reset_password_complete_spa.html"
    pass

class History(APIView):    
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "spa/history.html" 
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        message = "Rendered"
        return Response({'Done': message})

class Account(APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "spa/account.html" 
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        message = "Rendered"
        return Response({'Done': message})
