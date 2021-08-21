import json
from django.shortcuts import HttpResponse


# 返回json数据
class Result:

    @staticmethod
    def success(code=1,msg='操作成功',data=None):
        data = {
            'code':code,
            'msg':msg,
            'data':data
        }
        return HttpResponse(json.dumps(data, ensure_ascii=False), content_type="application/json,charset=utf-8")

    @staticmethod
    def error(code=0, msg='操作失败', data={}):
        data = {
            'code': code,
            'msg': msg,
            'data': data
        }
        return HttpResponse(json.dumps(data, ensure_ascii=False), content_type="application/json,charset=utf-8")