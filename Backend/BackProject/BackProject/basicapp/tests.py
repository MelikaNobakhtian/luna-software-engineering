import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from .models import *
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

client = Client()



class RequestPasswordResetEmailTest(TestCase):

    def setUp(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        id_num = '1234567891'
        password = '123456'
        self.valid_user = User(username=username,email=email,first_name=first_name,last_name=last_name,id_num=id_num,is_verified=True)
        self.valid_user.set_password(password)
        self.valid_user.save()
        self.invalid_user_mail = 'invalidtestuser@gmail.com'

    def test_send_forgot_password_email(self):
        response = client.post(reverse('request-reset-email'),
            data=json.dumps({'email':self.valid_user.email}),
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response_fail= client.post(reverse('request-reset-email'),
            data=json.dumps({'email':self.invalid_user_mail}),
            content_type='application/json')
        self.assertEqual(response_fail.status_code, status.HTTP_404_NOT_FOUND)


class PasswordTokenCheckAPITest(TestCase):

    def setUp(self):
        username = ['testuser' ,'secondtest',]
        email = ['testuser@gmail.com' , 'secondtest@gmail.com',]
        first_name = 'Lucy'
        last_name = 'Brown'
        id_num = ['1234567891','11111111']
        password = '123456'
        self.valid_user=[]
        self.valid_user.append(User(username=username[0],email=email[0],first_name=first_name,last_name=last_name,id_num=id_num[0],is_verified=True))
        self.valid_user.append(User(username=username[1],email=email[1],first_name=first_name,last_name=last_name,id_num=id_num[1],is_verified=True))
        self.valid_user[0].set_password(password)
        self.valid_user[1].set_password(password)
        self.valid_user[0].save()
        self.valid_user[1].save()
        self.uidb64 = []
        self.uidb64.append(urlsafe_base64_encode(smart_bytes(self.valid_user[0].id)))
        self.uidb64.append(urlsafe_base64_encode(smart_bytes(self.valid_user[1].id)))
        self.token = []
        self.token.append(PasswordResetTokenGenerator().make_token(self.valid_user[0]))
        self.token.append(PasswordResetTokenGenerator().make_token(self.valid_user[1]))

    def test_credentials_check_forgot_link(self):
        response = client.get(reverse('password-reset-confirm',kwargs={'uidb64':self.uidb64[0],'token':self.token[0]}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #invalid info
        response = client.get(reverse('password-reset-confirm',kwargs={'uidb64':self.uidb64[1],'token':self.token[0]}))
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)


class SetNewPasswordAPIViewTest(TestCase):

    def setUp(self):
        username = ['testuser' ,'secondtest',]
        email = ['testuser@gmail.com' , 'secondtest@gmail.com',]
        first_name = 'Lucy'
        last_name = 'Brown'
        id_num = ['1234567891','11111111']
        password = '123456'
        self.valid_user=[]
        self.valid_user.append(User(username=username[0],email=email[0],first_name=first_name,last_name=last_name,id_num=id_num[0],is_verified=True))
        self.valid_user.append(User(username=username[1],email=email[1],first_name=first_name,last_name=last_name,id_num=id_num[1],is_verified=True))
        self.valid_user[0].set_password(password)
        self.valid_user[1].set_password(password)
        self.valid_user[0].save()
        self.valid_user[1].save()
        self.uidb64 = []
        self.uidb64.append(urlsafe_base64_encode(smart_bytes(self.valid_user[0].id)))
        self.uidb64.append(urlsafe_base64_encode(smart_bytes(self.valid_user[1].id)))
        self.token = []
        self.token.append(PasswordResetTokenGenerator().make_token(self.valid_user[0]))
        self.token.append(PasswordResetTokenGenerator().make_token(self.valid_user[1]))

    def test_set_password(self):
        new_password = '333333'
        response = client.patch(reverse('password-reset-complete'),data=json.dumps({'password':new_password,'token':self.token[0],'uidb64':self.uidb64[0]}),
            content_type='application/json')
        print(response.data)
        print('are you here?')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        response = client.patch(reverse('password-reset-complete'),data=json.dumps({'password':'456789','token':self.token[0],'uidb64':self.uidb64[0]}),
            content_type='application/json')
        self.assertEqual(response.status_code,401)