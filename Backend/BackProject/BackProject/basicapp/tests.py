import json
from rest_framework import status
from django.test import TestCase, Client
from rest_framework.test import APIClient 
from django.urls import reverse
from .models import *
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
import io


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
        response = client.get(reverse('user-profile',kwargs={'pk' : user_id}))

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #test profile details
        self.assertEqual(self.user.first_name,response.data['first_name'])
        self.assertEqual(self.user.last_name,response.data['last_name'])
        self.assertEqual(self.user.username,response.data['username'])
        self.assertEqual(self.user.email,response.data['email'])

class ChangePasswordViewTest(TestCase):
    
    def setUp(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        

    def test_change_password_user(self):
        #first login user to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['tokens']['access']
        user_id = response_login.data['user_id']
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_password = '123456789'
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.put(reverse('change-password',kwargs={'pk' : user_id}),
            data=json.dumps({'old_password':self.password,'new_password':new_password}),
            content_type='application/json',headers =auth_headers)


        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #wrong old password
        response = new_client.put(reverse('change-password',kwargs={'pk' : user_id}),
            data=json.dumps({'old_password':'1233333','new_password':new_password}),
            content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

        #test login with new passowrd
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user.email , 'password':new_password}),
            content_type='application/json')
        self.assertEqual(response_login.status_code,status.HTTP_200_OK)


class UpdateUserProfileViewTest(TestCase):
    
    def setUp(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file
        

    def test_update_profile_user(self):
        #first login user to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['tokens']['access']
        user_id = response_login.data['user_id']
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_username = "new_username"
        new_firstname = 'Alice'
        new_lastname = 'Fey'
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.put(reverse('update-profile',kwargs={'pk' : user_id}),
            data=json.dumps({'username':new_username,'first_name':new_firstname , 'last_name':new_lastname}),
            content_type='application/json',headers =auth_headers)

        
        updated_user = User.objects.get(email=self.user.email)
        
        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #check updated info
        self.assertEqual(updated_user.username,new_username)
        self.assertEqual(updated_user.first_name,new_firstname)
        self.assertEqual(updated_user.last_name,new_lastname)

        #update profile photo
        response = new_client.put(reverse('update-profile',kwargs={'pk' : user_id}),
            data={'profile_photo':self.generate_photo_file()},format='multipart',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
    
        

