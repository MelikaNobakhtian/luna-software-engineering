from rest_framework import serializers
from .models import *
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.views import APIView

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
            raise serializers.ValidationError(self.default_error_messages['password'])

        if not username.isalnum():
            raise serializers.ValidationError(
                self.default_error_messages['username'])
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

        if filtered_user_by_email.exists() and filtered_user_by_email[0].auth_provider != 'email':
            raise AuthenticationFailed(
                detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')
        if not user.is_verified:
            raise AuthenticationFailed('Email is not verified')
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

class DoctorProfileSerializer(serializers.ModelSerializer):
    addresses = serializers.SerializerMethodField()
    #user = UserProfileSerializer(read_only=True)

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
        fields = ['state','doc','city','detail','id']