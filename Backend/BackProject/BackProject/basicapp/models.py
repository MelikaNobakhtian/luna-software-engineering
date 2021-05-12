from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from rest_framework_simplejwt.tokens import RefreshToken
from django_jalali.db import models as jmodels

class UserManager(BaseUserManager):

    def create_user(self, username, email,first_name,last_name,password=None,password2=None):
        if username is None:
            raise TypeError('Users should have a username')
        if email is None:
            raise TypeError('Users should have a Email')
        if first_name is None:
            raise TypeError('Users should have a Firstname')
        if last_name is None:
            raise TypeError('Users should have a Lastname')

        user = self.model(username=username, email=self.normalize_email(email),first_name=first_name,last_name=last_name)

        user.set_password(password)
        user.is_stuff = False
        user.save()
        return user

    def create_superuser(self, username, email, password=None):
        if password is None:
            raise TypeError('Password should not be none')

        user = self.create_user(username, email,'ad','ad', password)
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
    is_doctor = models.BooleanField(default=False)
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
    specialty = models.CharField(max_length=50,default='')
    sub_specialty = models.CharField(max_length=100,default='')
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )


class Address(models.Model):
    state = models.CharField(max_length=30)
    doc = models.ForeignKey(DoctorUser,on_delete=models.CASCADE)
    city = models.CharField(max_length=50)
    detail = models.TextField()

class Duration(models.Model):
    
    doctor = models.ForeignKey(DoctorUser,on_delete=models.CASCADE)
    duration = models.IntegerField()
    time_type = models.CharField(max_length=100)
    duration_number = models.CharField(max_length=200)
    is_edited = models.BooleanField(default=False)

class InPersonAppointment(models.Model):
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE ,null=True)
    doctor = models.ForeignKey(DoctorUser, on_delete=models.CASCADE )
    date = jmodels.jDateField(null=True)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE , null=True)
    address_number = models.IntegerField(null=True)
    duration = models.ForeignKey(Duration, on_delete=models.CASCADE)

    def delete(self):
        if not self.patient is None:
            email = self.patient.email
            date = str(self.date)
            email_body = 'Hi' + self.patient.username + '! \n' + 'Your appointment in ' + date + 'at '+str(self.start_time) + 'is deleted by Doctor. ' + self.doctor.user.last_name
            data = {'email_body': 'Hello!', 'to_email': email,
                'email_subject': 'Your appointment is deleted!'}
            Util.send_email(data)
        super(InPersonAppointment, self).delete()

class OnlineAppointment(models.Model):
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE ,null=True)
    doctor = models.ForeignKey(DoctorUser, on_delete=models.CASCADE )
    date = jmodels.jDateField(null=True)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    duration = models.ForeignKey(Duration, on_delete=models.CASCADE)

    def delete(self):
        if not self.patient is None:
            email = self.patient.email
            date = str(self.date)
            email_body = 'Hi' + self.patient.username + '! \n' + 'Your appointment in ' + date + 'at '+str(self.start_time) + 'is deleted by Doctor. ' + self.doctor.user.last_name
            data = {'email_body': 'Hello!', 'to_email': email,
                'email_subject': 'Your appointment is deleted!'}
            Util.send_email(data)
        super(OnlineAppointment, self).delete()
