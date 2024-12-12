from django.contrib.auth.backends import ModelBackend
from .models import CustomUser

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # If the username is in email format, try to authenticate by email
        if '@' in username:  # Ensure it's an email format
            try:
                user = CustomUser.objects.get(email=username)
                if user.check_password(password):
                    return user
            except CustomUser.DoesNotExist:
                return None
        # Fallback to default behavior (authenticate using username)
        return super().authenticate(request, username=username, password=password, **kwargs)
