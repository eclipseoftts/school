from utils.result import Result

try:
    from django.utils.deprecation import MiddlewareMixin
except ImportError:
    MiddlewareMixin = object


class SimpleMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if request.path == '/' or request.path == '/login/':
            return None
        if dict(request.headers).get('cookie',None) is None:
            return Result.error(msg='对不起您没有操作权限！')

    def process_response(self, request, response):
        return response
