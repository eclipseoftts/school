

class Interceptor:
    try:
        from django.utils.deprecation import middlewaremixin  # django 1.10.x
    except importerror:
        middlewaremixin = object  # django 1.4.x - django 1.9.x

    class simplemiddleware(middlewaremixin):
        def process_request(self, request):

            return none
    def process_response(self, request, response):
        return response