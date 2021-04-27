from rest_framework import serializers
from .models import *
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.views import APIView
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=68, min_length=6, write_only=True)

    password2 = serializers.CharField(style={'input_type': 'password'},write_only=True)

    default_error_messages = {
        'username': 'The username should only contain alphanumeric characters',
        'password': 'Passwords must match'
        }

    class Meta:
        model = User
        fields = ['id','username','first_name','last_name','email', 'password','password2']

    def validate(self, attrs):
        email = attrs.get('email', '')
        username = attrs.get('username', '')

        if attrs.get('password', '') != attrs.get('password2', ''):
            return{ "message":self.default_error_messages['password'],"status":200}

        if not username.isalnum():
            return{ "message":self.default_error_messages['username'],"status":200}
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(
        max_length=68, min_length=6, write_only=True)
    tokens = serializers.SerializerMethodField()
    is_doctor = serializers.BooleanField(read_only=True)
    doctor_id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField(read_only=True)

    def get_tokens(self, obj):
        user = User.objects.get(email=obj['email'])

        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    class Meta:
        model = User
        fields = ['email', 'password', 'tokens','user_id','doctor_id','is_doctor']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        filtered_user_by_email = User.objects.filter(email=email)
        user = auth.authenticate(email=email, password=password)

        mes = 'Please continue your login using ' + filtered_user_by_email[0].auth_provider
        if filtered_user_by_email.exists() and filtered_user_by_email[0].auth_provider != 'email':
            return{"message":mes,"status":200}

        if not user:
            return{"message":'Invalid credentials, try again',"status":200}
        if not user.is_verified:
            return{"message":'Email is not verified',"status":200}
        is_doctor = False
        user_id = user.id
        doctor_id = 0
        if DoctorUser.objects.filter(user=user).exists():
            is_doctor = True
            doctor_id = DoctorUser.objects.get(user=user).id

        return {
            'user_id': user_id,
            'doctor_id':doctor_id,
            'email': user.email,
            'tokens': user.tokens,
            'is_doctor': is_doctor
        }

        return super().validate(attrs)

class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)
    uidb64 = serializers.CharField(write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return{"message":'The reset link is invalid',"status":200}

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            return{"message":'The reset link is invalid',"status":200}
        return super().validate(attrs)

class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class DoctorProfileSerializer(serializers.ModelSerializer):
    addresses = serializers.SerializerMethodField()
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = DoctorUser
        fields = ['id','user','specialty','sub_specialty','addresses']

    def get_addresses(self,obj):
        add_list = Address.objects.filter(doc=obj)
        adds = AddressSerializer(add_list,many=True)
        return adds.data

class UpdateDoctorProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = DoctorUser
        fields = ['specialty','sub_specialty']

class UpdateDoctorAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = ['state','city','detail']

class AddressSerializer(serializers.ModelSerializer):
    #doc = DoctorProfileSerializer(read_only=True)
    class Meta:
        model = Address
        fields = ['id','state','doc','city','detail']

class ChangePasswordSerializer(serializers.Serializer):

    model = User
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class UpdateUserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username','first_name','last_name','profile_photo']

class SearchInUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"

    def to_representation(self,value):
        if DoctorUser.objects.filter(user=value).exists():
            return DoctorProfileSerializer(DoctorUser.objects.get(user=value),).data