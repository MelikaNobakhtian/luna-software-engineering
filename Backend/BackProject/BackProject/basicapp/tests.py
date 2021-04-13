import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from .models import *

client = Client()

class UserProfileViewTest(TestCase):

    def setUp(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        

    def test_get_user_profile_info(self):
        #first login user to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['tokens']['access']
        user_id = response_login.data['user_id']
        auth_headers = {'AUTHORIZATION': 'Bearer ' + access_token,}
        response = client.get(reverse('user-profile',kwargs={'pk' : user_id}), **auth_headers)

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #test profile details
        self.assertEqual(self.user.first_name,response.data['first_name'])
        self.assertEqual(self.user.last_name,response.data['last_name'])
        self.assertEqual(self.user.username,response.data['username'])
        self.assertEqual(self.user.email,response.data['email'])

