from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.db.models import Q

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Allows authentication with either username OR email address in Django Admin and Django Auth.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get('email')
        if not username or not password:
            return None

        # Look up by email or username (case-insensitive)
        user = User.objects.filter(
            Q(username__iexact=username.strip()) | Q(email__iexact=username.strip())
        ).first()

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
