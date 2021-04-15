import json
from rest_framework import status
from django.test import TestCase, Client
from rest_framework.test import APIClient 
from django.urls import reverse
from .models import *
from .serializers import *
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from django.core.files import File
from unittest import mock
import io


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

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
        
        response = client.get(reverse('doctor-profile',kwargs={'pk' : doc_id}))

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #test profile details
        self.assertEqual(self.doc.specialty,response.data['specialty'])
        self.assertEqual(self.doc.sub_specialty,response.data['sub_specialty'])

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

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
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

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.post(reverse('set-doctor-address',kwargs={'pk' : doc_id}),
            data=json.dumps({'count':1,'addresses':[
        {
            "state":"Mazandaran",
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

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
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
        self.assertEqual(response.data['city'],new_city)
        self.assertEqual(response.data['detail'],new_detail)

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
        self.assertEqual(response_fail.status_code, status.HTTP_404_NOT_FOUND)


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
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)


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
        response = client.patch(reverse('password-reset-complete'),data=json.dumps({'password':new_password,'token':self.token[0],'uidb64':self.uidb64[0]}),
            content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        response = client.patch(reverse('password-reset-complete'),data=json.dumps({'password':'456789','token':self.token[0],'uidb64':self.uidb64[0]}),
            content_type='application/json')
        self.assertEqual(response.status_code,401)
