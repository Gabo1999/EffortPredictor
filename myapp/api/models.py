from django.db import models
from django.conf import settings

#Create your models here.
class Entry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=0)
    name = models.TextField(default="Form")
    estimation_date = models.DateTimeField(auto_now_add=True)

class Story(models.Model):
    issue_key = models.CharField(max_length=200)
    severity = models.CharField(max_length=30)
    priority = models.CharField(max_length=30)
    summary = models.TextField()
    description = models.TextField()
    days_of_work = models.IntegerField()
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, default=0)