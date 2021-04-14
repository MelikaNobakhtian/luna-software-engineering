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

class DoctorProfileViewTest(TestCase):

    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        user.set_passwoUserrd(self.password)
        user.save()
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        self.doc = DoctorUser(degree=file,user=user)
        self.doc.specialty='dermatology'
        self.doc.save()
        

    def test_get_doctor_profile_info(self):
        #first login doctor to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.doc.user.password}),
            content_type='application/json')

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
        response = client.get(reverse('doctor-profile',kwargs={'pk' : doctor_id}))

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #test profile details
        #self.assertEqual(self.doc.user,response.data['user'])
        self.assertEqual(self.doc.specialty,response.data['specialty'])
        self.assertEqual(self.doc.sub_specialty,response.data['sub_specialty'])

class UpdateDoctorProfileViewTest(TestCase):
    
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        user.set_passwoUserrd(self.password)
        user.save()
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        self.doc = DoctorUser(degree=file,user=user)
        self.doc.specialty='dermatology'
        self.doc.save()

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file
        

    def test_update_profile_doctor(self):
        #first login doctor to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.doc.user.password}),
            content_type='application/json')

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_specialty = "skin"
        new_sub_specialty = "New"
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.put(reverse('update-doctor-profile',kwargs={'pk' : doctor_id}),
            data=json.dumps({'specialty':new_specialty,'sub_specialty':new_sub_specialty}),
            content_type='application/json',headers =auth_headers)

        
        updated_doc = DoctorUser.objects.get(user=self.doc.user)
        
        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #check updated info
        self.assertEqual(updated_doctor.specialty,new_specialty)
        self.assertEqual(updated_doctor.sub_specialty,new_sub_specialty)

class SetDoctorAddressViewTest(TestCase):

    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        user.set_passwoUserrd(self.password)
        user.save()
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        self.doc = DoctorUser(degree=file,user=user)
        self.doc.specialty='dermatology'
        self.doc.save()
        

    def test_set_doctor_address(self):
        #first login doctor to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.doc.user.password}),
            content_type='application/json')

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.post(reverse('set-doctor-address',kwargs={'pk' : doctor_id}),
            data=json.dumps({'count':1,'addresses':[
        {
            "state":"Mazandaran",
            "city":"Sari",
            "detail":"Farhang St."
        }]}),
            content_type='application/json',headers =auth_headers)

        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)
    
        #test profile details
        # #self.assertEqual(self.doc.user,response.data['user'])
        # self.assertEqual(self.doc.specialty,response.data['specialty'])
        # self.assertEqual(self.doc.sub_specialty,response.data['sub_specialty'])

class UpdateDoctorAddressViewTest(TestCase):
    
    def setUp(self):
        username = 'testdoctor'
        email = 'testdoctor@gmail.com'
        first_name = 'Ramin'
        last_name = 'Mofarrah'
        password = '123456'
        user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        user.set_passwoUserrd(self.password)
        user.save()
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        self.doc = DoctorUser(degree=file,user=user)
        self.doc.specialty='dermatology'
        self.doc.save()

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file
        

    def test_update_address_doctor(self):
        #first login doctor to get access token
        response_login = client.post(reverse('login'),
            data=json.dumps({'email':self.doc.user.email , 'password':self.doc.user.password}),
            content_type='application/json')

        access_token = response_login.data['tokens']['access']
        doc_id = response_login.data['doctor_id']
        auth_headers = {'HTTP_AUTHORIZATION': 'Bearer ' + access_token,}
        new_city = "Babol"
        new_detail = "Farmandari"
        new_client = APIClient(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = new_client.put(reverse('update-doctor-address',kwargs={'pk' : doctor_id}),
            data=json.dumps({'city':new_city,'detail':new_detail}),
            content_type='application/json',headers =auth_headers)

        
        updated_doc = DoctorUser.objects.get(user=self.doc.user)
        
        #test status code
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #check updated info
        self.assertEqual(updated_doctor.addresses[0].city,new_city)
        self.assertEqual(updated_doctor.addresses[0].detail,new_detail)