import json
from rest_framework import status
from django.test import TestCase, Client
from rest_framework.test import APIClient
from .models import *
from .serializers import *
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from django.core.files import File
from unittest import mock
import io
import jdatetime
from datetime import time
from django.db import IntegrityError
from django.urls import reverse, resolve
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from channels.testing import HttpCommunicator, WebsocketCommunicator
from channels.db import database_sync_to_async
from .consumers import ChatConsumer, get_groups_to_add, get_user_by_pk, \
    get_message_by_id, get_unread_count, mark_message_as_read, save_text_message



client = Client()

class DoctorProfileViewTest(TestCase):

    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock,specialty="dermatology")
        self.doc.save()
        
    def test_get_doctor_profile_info(self):

        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['data']['tokens']['access']
        doc_id = response_login.data['data']['doctor_id']
        
        response = client.get(reverse('doctor-profile',kwargs={'pk' : doc_id}))

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #test profile details
        self.assertEqual(self.doc.specialty,response.data['data']['specialty'])
        self.assertEqual(self.doc.sub_specialty,response.data['data']['sub_specialty'])

class UpdateDoctorProfileViewTest(TestCase):
    
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file
        

    def test_update_profile_doctor(self):
        
        
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['data']['tokens']['access']
        doc_id = response_login.data['data']['doctor_id']
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_specialty = "skin"
        new_sub_specialty = "New"
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.put(reverse('update-doctor-profile',kwargs={'pk' : doc_id}),
            data=json.dumps({'specialty':new_specialty,'sub_specialty':new_sub_specialty}),
            content_type='application/json',headers =auth_headers)

        
        updated_doc = DoctorUser.objects.get(user=self.user)
        
        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #check updated info
        self.assertEqual(updated_doc.specialty,new_specialty)
        self.assertEqual(updated_doc.sub_specialty,new_sub_specialty)

class SetDoctorAddressViewTest(TestCase):

    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()
        

    def test_set_doctor_address(self):
        

        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['data']['tokens']['access']
        doc_id = response_login.data['data']['doctor_id']
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.post(reverse('set-doctor-address',kwargs={'pk' : doc_id}),
            data=json.dumps({'count':1,'addresses':[
        {
            #Mazandaran
            "state":"27",
            "city":"Sari",
            "detail":"Farhang St."
        }]}),
            content_type='application/json')

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
class UpdateDoctorAddressViewTest(TestCase):
    
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()
        add = Address(doc=self.doc,state='Mazandaran',city='Sari',detail='Farhang St.')
        add.save()

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file
        

    def test_update_address_doctor(self):
        

        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['data']['tokens']['access']
        doc_id = response_login.data['data']['doctor_id']
        my_doc = DoctorUser.objects.get(pk=doc_id)
        first_address = Address.objects.filter(doc=my_doc)[0].id
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_city = "Babol"
        new_detail = "Farmandari"
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.put(reverse('update-doctor-address',kwargs={'doc_pk' : doc_id,'add_pk' : first_address}),
            data=json.dumps({'city':new_city,'detail':new_detail}),
            content_type='application/json',headers =auth_headers)

        

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #check updated info
        self.assertEqual(response.data['data']['city'],new_city)
        self.assertEqual(response.data['data']['detail'],new_detail)

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
        access_token = response_login.data['data']['tokens']['access']
        user_id = response_login.data['data']['user_id']
        response = client.get(reverse('user-profile',kwargs={'pk' : user_id}))

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #test profile details
        self.assertEqual(self.user.first_name,response.data['data']['first_name'])
        self.assertEqual(self.user.last_name,response.data['data']['last_name'])
        self.assertEqual(self.user.username,response.data['data']['username'])
        self.assertEqual(self.user.email,response.data['data']['email'])

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

        access_token = response_login.data['data']['tokens']['access']
        user_id = response_login.data['data']['user_id']
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
        self.assertEqual(response.status_code,status.HTTP_200_OK)

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

        access_token = response_login.data['data']['tokens']['access']
        user_id = response_login.data['data']['user_id']
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

class RequestPasswordResetEmailTest(TestCase):

    def setUp(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        password = '123456'
        self.valid_user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
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
        self.assertEqual(response_fail.status_code, status.HTTP_200_OK)

class PasswordTokenCheckAPITest(TestCase):

    def setUp(self):
        username = ['testuser' ,'secondtest',]
        email = ['testuser@gmail.com' , 'secondtest@gmail.com',]
        first_name = 'Lucy'
        last_name = 'Brown'
        password = '123456'
        self.valid_user=[]
        self.valid_user.append(User(username=username[0],email=email[0],first_name=first_name,last_name=last_name,is_verified=True))
        self.valid_user.append(User(username=username[1],email=email[1],first_name=first_name,last_name=last_name,is_verified=True))
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
        self.assertEqual(response.status_code,status.HTTP_200_OK)

class SetNewPasswordAPIViewTest(TestCase):

    def setUp(self):
        username = ['testuser' ,'secondtest',]
        email = ['testuser@gmail.com' , 'secondtest@gmail.com',]
        first_name = 'Lucy'
        last_name = 'Brown'
        password = '123456'
        self.valid_user=[]
        self.valid_user.append(User(username=username[0],email=email[0],first_name=first_name,last_name=last_name,is_verified=True))
        self.valid_user.append(User(username=username[1],email=email[1],first_name=first_name,last_name=last_name,is_verified=True))
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
        response = client.post(reverse('password-reset-complete'),data=json.dumps({'password':new_password,'token':self.token[0],'uidb64':self.uidb64[0]}),
            content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        response = client.post(reverse('password-reset-complete'),data=json.dumps({'password':'456789','token':self.token[0],'uidb64':self.uidb64[0]}),
            content_type='application/json')
        self.assertEqual(response.status_code,200)

class DoctorPageViewTest(TestCase):
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock,specialty="dermatology")
        self.doc.save()
    
    def test_get_doctor_info(self):

        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.password}),
            content_type='application/json')

        access_token = response_login.data['data']['tokens']['access']
        doc_id = response_login.data['data']['doctor_id']
        
        response_get = client.get('/doctor-info/'+str(doc_id)+'/',content_type='application/json')

        #test message and status
        self.assertEqual(response_get.status_code,status.HTTP_200_OK)
        self.assertEqual(response_get.data['message'],"success")
    
        #test details
        self.assertEqual(self.user.first_name,response_get.data['data']['user']['first_name'])
        self.assertEqual(self.doc.specialty,response_get.data['data']['specialty'])
        self.assertEqual(self.doc.sub_specialty,response_get.data['data']['sub_specialty'])

class SearchViewTest(TestCase):
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        self.doc_user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.doc_user.set_password(password)
        self.doc_user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'
        self.doc = DoctorUser(user=self.doc_user,degree=file_mock)
        self.doc.save()
        add = Address(doc=self.doc,state='????????',city='Sari',detail='Farhang St.')
        add.save()

        username2 = 'username'
        email2 = 'testdoctor2@gmail.com'
        first_name2 = 'Nahid'
        last_name2 = 'Talebi'
        password2 = '123456'
        self.doc_user2 = User(username=username2,email=email2,first_name=first_name2,last_name=last_name2,is_verified=True)
        self.doc_user2.set_password(password2)
        self.doc_user2.save()
        file_mock2 = mock.MagicMock(spec=File)
        file_mock2.name = 'test2.pdf'
        self.doc2 = DoctorUser(user=self.doc_user2,degree=file_mock2)
        self.doc2.save()
        add2 = Address(doc=self.doc2,state='????????',city='Sari',detail='Farhang St.')
        add2.save() 

    def test_search_by_state(self):

        response_search = client.get("/doctors?state=???",content_type='application/json')

        #test status code
        self.assertEqual(response_search.status_code,status.HTTP_200_OK)

        #test data
        self.assertEqual(2,len(response_search.data['doctors']))
        self.assertEqual(self.doc_user.first_name,response_search.data['doctors'][0]['user']['first_name'])
        self.assertEqual(self.doc_user2.first_name,response_search.data['doctors'][1]['user']['first_name'])

class DurationAPIViewTest(TestCase):

    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()

    def test_duration(self):
        doc_id = DoctorUser.objects.get(user=self.user).id

        #post duration
        body = { 'time_type': 'general' , 'duration_number':'red' , 'duration' : 20}
        response = client.post(reverse('duration',kwargs={'pk':doc_id}),
        data=json.dumps(body),
            content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['doctor']['user']['first_name'],self.user.first_name)

        body = {'time_type': 'visit' , 'duration_number':'blue' , 'duration' : 40}
        response = client.post(reverse('duration',kwargs={'pk':doc_id}),
        data=json.dumps(body),content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #get durations
        response = client.get(reverse('duration',kwargs={'pk':doc_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),2)
        self.assertEqual(response.data[0]['time_type'],'general')
        self.assertEqual(response.data[1]['time_type'],'visit')

class UpdateDurationAPIViewTest(TestCase):
    
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()

        duration = Duration(time_type='general',duration=30,duration_number='brown',doctor=self.doc)
        duration.save()

    def test_update_duration(self):
        doc_id = DoctorUser.objects.get(user=self.user).id
        duration_id = Duration.objects.get(doctor=DoctorUser.objects.get(user=self.user)).id

        #put duration
        response = client.put(reverse('update-duration',kwargs={'doc_id':doc_id , 'pk':duration_id}),
        data=json.dumps({'duration':20 , 'time_type': 'visit' , 'duration_number':'black'}),content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['time_type'],'visit')
        self.assertEqual(response.data['duration'],20)
        self.assertEqual(response.data['duration_number'],'black')
        self.assertEqual(Duration.objects.get(time_type='general').is_edited,True)

        #delete duration
        new_duration_id = Duration.objects.get(time_type='visit').id
        response = client.delete(reverse('update-duration',kwargs={'doc_id':doc_id , 'pk':new_duration_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'successful!')

class InPersonAppointmentAPIView(TestCase):

    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()
        self.add = Address(doc=self.doc,state='Mazandaran',city='Sari',detail='Farhang St.')
        self.add.save()

        duration = Duration(time_type='general',duration=30,duration_number='violet',doctor=self.doc)
        duration.save()

    def test_inperson_appointemt(self):
        doc = DoctorUser.objects.get(user=self.user)
        doc_id = doc.id
        duration = Duration.objects.get(doctor=doc)
        duration_id = duration.id
        address_id = self.add.id

        #post inperson appointment
        body = {
        "start_day": "1400-02-29",
        "end_day":"1400-02-30",
        "appointments": [
             {
                 "duration_id":duration_id,
                    "address_number":7,
                    "doc_id":doc_id,
                    "address_id":address_id,
                    "start_time":"17:00",
                    "end_time":"17:20"
             }
             ,

             {
                    "address_number":7,
                    "duration_id":duration_id,
                    "doc_id":doc_id,
                    "address_id":address_id,
                    "start_time":"17:20",
                    "end_time":"17:40"
             }]}
        response = client.post(reverse('inperson-apt',kwargs={'pk':doc_id}),
        data=json.dumps(body),content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),4)

        #get inperson appointment
        response = client.get('/doctor/'+str(doc_id)+'/inperson-appointment/?date=1400-02-30')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),2)
        response = client.get('/doctor/'+str(doc_id)+'/inperson-appointment/?date=1400-02-31')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),0)

        #delete inperson appointments
        response = client.delete(reverse('inperson-apt',kwargs={'pk':doc_id}),
        data=json.dumps({'index':[1,3]}),content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        
class OnlineAppointmentAPIView(TestCase):
    
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()
    
        duration = Duration(time_type='online',duration=30,duration_number='violet',doctor=self.doc)
        duration.save()

    def test_inperson_appointemt(self):
        doc = DoctorUser.objects.get(user=self.user)
        doc_id = doc.id
        duration = Duration.objects.get(doctor=doc)
        duration_id = duration.id

        #post online appointment
        body = {
        "start_day": "1400-02-29",
        "end_day":"1400-02-30",
        "appointments": [
             {
                 "duration_id":duration_id,
                    "doc_id":doc_id,
                    "start_time":"17:00",
                    "end_time":"17:20"
             }
             ,

             {
                    "duration_id":duration_id,
                    "doc_id":doc_id,
                    "start_time":"17:20",
                    "end_time":"17:40"
             }]}
        response = client.post(reverse('online-apt',kwargs={'pk':doc_id}),
        data=json.dumps(body),content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),4)

        #get online appointment
        response = client.get('/doctor/'+str(doc_id)+'/online-appointment/?date=1400-02-30')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),2)
        response = client.get('/doctor/'+str(doc_id)+'/online-appointment/?date=1400-02-31')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),0)

        #delete online appointments
        response = client.delete(reverse('online-apt',kwargs={'pk':doc_id}),
        data=json.dumps({'index':[1,3]}),content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

class OnlineDurationTest(TestCase):

    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.user,degree=file_mock)
        self.doc.save()

    def test_online_duration(self):
        doc = DoctorUser.objects.get(user=self.user)
        doc_id = doc.id

        #get online duration
        response = client.get(reverse('online-duration',kwargs={'pk':doc_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'No duration for online!')

        duration = Duration(time_type='online',duration=30,duration_number='violet',doctor=self.doc)
        duration.save()

        response = client.get(reverse('online-duration',kwargs={'pk':doc_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['duration'],30)

        #put online duration
        edited_duration = 40
        response = client.put(reverse('online-duration',kwargs={'pk':doc_id}),
        data=json.dumps({'duration':edited_duration}),content_type='application/json') 
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        response = client.get(reverse('online-duration',kwargs={'pk':doc_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['duration'],40)

class FilterBySpecialtyViewTest(TestCase):
    def setUp(self):
        self.Setup_doctor1()
        self.Setup_doctor2()

    def Setup_doctor1(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        self.doc_user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.doc_user.set_password(password)
        self.doc_user.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'
        self.doc = DoctorUser(user=self.doc_user,degree=file_mock,specialty="چشم پزشکی")
        self.doc.save()
        add = Address(doc=self.doc,state='Mazandaran',city='Sari',detail='Farhang St.')
        add.save() 

    def Setup_doctor2(self):
        username2 = 'testdoctor2'
        email2 = 'testdoctor2@gmail.com'
        first_name2 = 'Ramin2'
        last_name2 = 'Mofarrah2'
        password2 = '123456'
        self.doc_user2 = User(username=username2,email=email2,first_name=first_name2,last_name=last_name2,is_verified=True)
        self.doc_user2.set_password(password2)
        self.doc_user2.save()
        file_mock2 = mock.MagicMock(spec=File)
        file_mock2.name = 'test.pdf'
        self.doc2 = DoctorUser(user=self.doc_user2,degree=file_mock2,specialty="چشم پزشکی")
        self.doc2.save()
        add2 = Address(doc=self.doc2,state='Mazandaran',city='Sari',detail='Farhang St.')
        add2.save() 

    def test_filter_by_specialty(self):

        response = client.get("/home/filterbyspecialty/1/")

        self.assertEqual(response.status_code,status.HTTP_200_OK)

        self.assertEqual(2,len(response.data['data']))
        self.assertEqual(self.doc_user.first_name,response.data['data'][0]['user']['first_name'])
        self.assertEqual(self.doc_user2.first_name,response.data['data'][1]['user']['first_name'])

class ReserveOnlineAppointmentViewTest(TestCase):
    
    def setUp(self):
        self.setUp_patient()
        self.setUp_doctor()
        self.setUp_onlinetime()

    def setUp_onlinetime(self):
        self.duration = Duration(time_type='online',duration=30,duration_number='violet',doctor=self.doc)
        self.duration.save()
        self.apt = OnlineAppointment(doctor=self.doc,duration=self.duration,date=jdatetime.date(1400,3,7),start_time=time(12,30),end_time=time(13,0))
        self.apt.save()


    def setUp_patient(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()

    def setUp_doctor(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        self.docuser = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.docuser.set_password(password)
        self.docuser.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.docuser,degree=file_mock)
        self.doc.save()   

    def test_reserve_cancel_online(self):
        #login user to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user.email , 'password':self.password}),
            content_type='application/json')
        self.assertEqual(response_login.status_code,status.HTTP_200_OK)
        access_token = response_login.data['data']['tokens']['access']

        #reserve online appointment
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.post(reverse('reserve-online',kwargs={'pk' : self.apt.id , 'doc_id':self.doc.id}),
            data=json.dumps({}),content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'reserved!')
        self.assertEqual(self.user,OnlineAppointment.objects.get(pk=self.apt.id).patient)

        #cancel online appointment
        response = new_client.put(reverse('reserve-online',kwargs={'pk' : self.apt.id , 'doc_id':self.doc.id}),
            data=json.dumps({}),content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'canceled!')
        self.assertEqual(None,OnlineAppointment.objects.get(pk=self.apt.id).patient)

class ReserveInPersonAppointmentViewTest(TestCase):
    
    def setUp(self):
        self.setUp_patient()
        self.setUp_doctor()
        self.setUp_inpersontime()

    def setUp_inpersontime(self):
        self.duration = Duration(time_type='general',duration=30,doctor=self.doc)
        self.duration.save()
        self.apt = InPersonAppointment(doctor=self.doc,duration=self.duration,date=jdatetime.date(1400,3,7),start_time=time(12,30),end_time=time(13,0),address=self.add)
        self.apt.save()


    def setUp_patient(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        self.password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(self.password)
        self.user.save()

    def setUp_doctor(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        self.docuser = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.docuser.set_password(password)
        self.docuser.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.docuser,degree=file_mock)
        self.doc.save()

        self.add = Address(doc=self.doc,state='Mazandaran',city='Sari',detail='Farhang St.')
        self.add.save()

    def test_reserve_cancel_inperson(self):
        #login user to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user.email , 'password':self.password}),
            content_type='application/json')
        self.assertEqual(response_login.status_code,status.HTTP_200_OK)
        access_token = response_login.data['data']['tokens']['access']

        #reserve inperson appointment
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.post(reverse('reserve-inperson',kwargs={'pk' : self.apt.id , 'doc_id':self.doc.id}),
            data=json.dumps({}),content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'reserved!')
        self.assertEqual(self.user,InPersonAppointment.objects.get(pk=self.apt.id).patient)

        #cancel inperson appointment
        response = new_client.put(reverse('reserve-inperson',kwargs={'pk' : self.apt.id , 'doc_id':self.doc.id}),
            data=json.dumps({}),content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'canceled!')
        self.assertEqual(None,InPersonAppointment.objects.get(pk=self.apt.id).patient)

        
class ConsumerTests(TestCase):
    def setUp(self) -> None:
        # self.u1, self.u2 = UserFactory.create(), UserFactory.create()
        # self.dialog: DialogsModel = DialogsModelFactory.create(user1=self.u1, user2=self.u2)
        # self.msg: MessageModel = MessageModelFactory.create(sender=self.u1, recipient=self.u2)
        # self.unread_msg: MessageModel = MessageModelFactory.create(sender=self.u1, recipient=self.u2, read=False)

        # self.sender, self.recipient = UserFactory.create(), UserFactory.create()
        # num_unread = faker.random.randint(1, 20)
        # _ = MessageModelFactory.create_batch(num_unread, read=False, sender=self.sender, recipient=self.recipient)
        # self.num_unread = num_unread

        self.Setup_user1()
        self.Setup_user2()
        self.Setup_dialog()
        self.Setup_message()

    def Setup_user1(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        self.user1 = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user1.set_password(password)
        self.user1.save()

    def Setup_user2(self):
        username2 = 'testdoctor2'
        email2 = 'testdoctor2@gmail.com'
        first_name2 = 'Ramin2'
        last_name2 = 'Mofarrah2'
        password2 = '123456'
        self.user2 = User(username=username2,email=email2,first_name=first_name2,last_name=last_name2,is_verified=True)
        self.user2.set_password(password2)
        self.user2.save()

    def Setup_dialog(self):
        self.dialog = DialogsModel(user1=self.user1,user2=self.user2)
        self.dialog.save()

    def Setup_message(self):
        self.message = MessageModel(sender=self.user1,recipient=self.user2,text="Hello",read=True)
        self.message.save()
        self.unread_message = MessageModel(sender=self.user1,recipient=self.user2,text="Where are you??",read=False)
        self.unread_message.save()


    # async def test_groups_to_add(self):
    #     groups = await get_groups_to_add(self.user1)
    #     self.assertEqual({1, 2}, groups)
    #     groups2 = await get_groups_to_add(self.user2)
    #     self.assertEqual({2, 1}, groups2)

    # async def test_get_user_by_pk(self):
    #     user = await get_user_by_pk("1000")
    #     self.assertIsNone(user)
    #     user = await get_user_by_pk(self.user1.id)
    #     self.assertEqual(user, self.user1)

    # async def test_get_message_by_id(self):
    #     m = await get_message_by_id(999999)
    #     self.assertIsNone(m)
    #     m = await get_message_by_id(self.message.id)
    #     t = (str(self.user2.pk), str(self.user1.pk))
    #     self.assertEqual(m, t)

    # async def test_mark_message_as_read(self):
    #     self.assertFalse(self.unread_message.read)
    #     await mark_message_as_read(self.unread_message.id)
    #     await database_sync_to_async(self.unread_message.refresh_from_db)()
    #     self.assertTrue(self.unread_message.read)

    # async def test_get_unread_count(self):
    #     count = await get_unread_count(self.user1, self.user2)
    #     self.assertEqual(count, 1)

    # async def test_save_x_message(self):
    #     msg = await save_text_message(text="text", from_=self.user1, to=self.user2)
    #     self.assertIsNotNone(msg)

    # async def test_connect_basic(self):
    #     communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "/chat_ws")
    #     communicator.scope["user"] = self.user1
    #     connected, subprotocol = await communicator.connect()
    #     assert connected

class RateDoctorTest(TestCase):

    def setUp(self):
        self.Setup_user1()
        self.Setup_user2()
        self.setUp_doctor()

    def Setup_user1(self):
        username = 'leili'
        email = 'leili@gmail.com'
        first_name = 'Leili'
        last_name = 'Samiei'
        self.password1 = '123456'
        self.user1 = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user1.set_password(self.password1)
        self.user1.save()

    def Setup_user2(self):
        username2 = 'Sohrab'
        email2 = 'sohrab@gmail.com'
        first_name2 = 'Sohrab'
        last_name2 = 'Salehi'
        self.password2 = '123456'
        self.user2 = User(username=username2,email=email2,first_name=first_name2,last_name=last_name2,is_verified=True)
        self.user2.set_password(self.password2)
        self.user2.save()

    def setUp_doctor(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        self.docuser = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.docuser.set_password(password)
        self.docuser.save()
        file_mock = mock.MagicMock(spec=File)
        file_mock.name = 'test.pdf'

        self.doc = DoctorUser(user=self.docuser,degree=file_mock)
        self.doc.save()

    def test_rate_doctor(self):

        #login users to get access token
        access_token = []
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user1.email , 'password':self.password1}),
            content_type='application/json')
        self.assertEqual(response_login.status_code,status.HTTP_200_OK)
        access_token.append(response_login.data['data']['tokens']['access'])
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.user2.email , 'password':self.password2}),
            content_type='application/json')
        self.assertEqual(response_login.status_code,status.HTTP_200_OK)
        access_token.append(response_login.data['data']['tokens']['access'])

        #get rate by user2 when not rated
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token[1]}
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token[1])
        response = new_client.get(reverse('rate',kwargs={'pk' : self.doc.id }),headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'No rate!')


        #rate by user1
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token[0]}
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token[0])
        response = new_client.post(reverse('rate',kwargs={'pk' : self.doc.id }),
            data=json.dumps({'rate' : 4}),content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'Successfully Rated!')
        self.assertEqual(self.doc.average_rating,4)

        #get rate by user1 when rated
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token[0]}
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token[0])
        response = new_client.get(reverse('rate',kwargs={'pk' : self.doc.id }),headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['rate'],4)

        #rate by user2
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token[1]}
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token[1])
        response = new_client.post(reverse('rate',kwargs={'pk' : self.doc.id }),
            data=json.dumps({'rate' : 5}),content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'Successfully Rated!')
        self.assertEqual(self.doc.average_rating,4.5)

        #change rate user1
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token[0]}
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token[0])
        response = new_client.put(reverse('rate',kwargs={'pk' : self.doc.id }),
            data=json.dumps({'rate' : 3}),content_type='application/json',headers =auth_headers)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'update rate')
        self.assertEqual(self.doc.average_rating,4)





