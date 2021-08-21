from django.http import HttpResponse
from django.shortcuts import render
from utils.result import Result
from admin.models import Admin
from django.views.generic import View
from utils.redis import Redis


class Login(View):

    def get(self,request,*args,**kwargs):
        return render(request, 'login.html')

    def post(self,request,*args,**kwargs):
        username = request.POST.get('username',None)
        if username is None:
            return Result.error(msg='用户名不能为空！')
        password = request.POST.get('password', None)
        if username is None:
            return Result.error(msg='密码不能为空！')
        Admin.objects.create(username=username, password=password)
        Redis.save(username,password)
        response = HttpResponse()
        response.set_signed_cookie(key='cookie',value='cookie',salt='salt')
        return Result.success()
