import jwt
from django.conf import settings
from django.http import JsonResponse

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip auth for public routes
        if request.path in ['/users/login/', '/users/register/', '/users/csrf/', '/users/csrf']:
            return self.get_response(request)

        # Extract token from headers
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse(
                {"error": "Authorization header missing or invalid"},
                status=401
            )

        token = auth_header.split(' ')[1]

        # Validate token
        try:
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            if "_id" not in decoded:
                return JsonResponse({"error": "Invalid token: Missing user ID"}, status=401)

            # Set request attribute
            request.authorized = decoded["_id"]  
        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

        return self.get_response(request)
