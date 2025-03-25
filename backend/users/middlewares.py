from django.http import JsonResponse

class AllowOptionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            return self.handle_options_request(request)

        response = self.get_response(request)
        response = self.add_cors_headers(response)
        return response

    def handle_options_request(self, request):
        response = JsonResponse({"message": "Preflight request allowed"}, status=200)
        response = self.add_cors_headers(response)
        return response

    def add_cors_headers(self, response):
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
        response["Access-Control-Allow-Headers"] = "X-CSRFToken, Content-Type"
        response["Access-Control-Allow-Credentials"] = "true"
        return response