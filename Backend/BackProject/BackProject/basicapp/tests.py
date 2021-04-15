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