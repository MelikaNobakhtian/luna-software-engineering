from rest_framework import serializers
from .models import User
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

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
        fields = ['email', 'username', 'password','password2']

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