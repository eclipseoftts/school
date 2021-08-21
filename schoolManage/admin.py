from django.contrib import admin
from django.db import models
# Register your models here.

class Article(models.Model):
    name = models.CharField(max_length=80)