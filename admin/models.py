from django.db import models


class Admin(models.Model):
    id = models.IntegerField(unique=True,primary_key=True)
    username = models.CharField(max_length=80, unique=True)
    password = models.CharField(max_length=80)
    objects = models.Manager()

    class Meta:
        db_table = 'sys_admin'
