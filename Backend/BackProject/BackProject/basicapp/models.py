from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken

class UserManager(BaseUserManager):

    def create_user(self, username, email,first_name,last_name,id_num, password=None,password2=None):
        if username is None:
            raise TypeError('Users should have a username')
        if email is None:
            raise TypeError('Users should have a Email')
        if first_name is None:
            raise TypeError('Users should have a Firstname')
        if last_name is None:
            raise TypeError('Users should have a Lastname')
        if id_num is None:
            raise TypeError('Users should have an ID number')

        user = self.model(username=username, email=self.normalize_email(email),first_name=first_name,last_name=last_name,id_num=id_num)

        user.set_password(password)
        user.is_stuff = False
        user.save()
        return user

    def create_superuser(self, username, email, password=None):
        if password is None:
            raise TypeError('Password should not be none')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


AUTH_PROVIDERS = {'email': 'email'}


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=50,default='unknown')
    last_name = models.CharField(max_length=100,default='unknown')
    email = models.EmailField(max_length=255, unique=True)
    profile_photo = models.ImageField(upload_to='profile_photos',default='default.png')
    is_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default=AUTH_PROVIDERS.get('email'))

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.email

    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

class DoctorUser(models.Model):
    degree = models.FileField(blank=False,null=False,default='',upload_to="degrees/")
    specialty = models.CharField(max_length=50)
    sub-specialty = models.CharField(max_length=100)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    state = models.CharField(max_length=30)