from pymongo import MongoClient
from django.conf import settings
import urllib.parse

MONGO_SETTINGS = settings.MONGO_SETTINGS

password = urllib.parse.quote(MONGO_SETTINGS['db_pass'])
username = urllib.parse.quote(MONGO_SETTINGS['db_user'])
db_name = MONGO_SETTINGS['db_name']
db_host_mongo = MONGO_SETTINGS['db_host']

mongo_uri = "mongodb+srv://{username}:{password}@{host}/{db_name}?retryWrites=true&w=majority".format(
    username=username, password=password, host=db_host_mongo, db_name=db_name)

client = MongoClient(mongo_uri)
database = client[db_name]
auth_collection = MONGO_SETTINGS['auth_collection']