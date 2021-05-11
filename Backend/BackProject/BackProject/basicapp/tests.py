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

class OnlineAppointmentAPIViewTest(TestCase):

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

    def test_online_time(self):
        #new_client = APIClient()
        doc_id = DoctorUser.objects.get(user=self.user).id
        apts = {
        "start_day": "1400-02-13",
        "end_day":"1400-02-17",
        "appointments": [
             {
                    "duration":20,
                    "doc_id":doc_id,
                    "start_time":"18:00",
                    "end_time":"18:20"
             }
                        ]
             }
        response = client.post(reverse('online-apt',kwargs={'pk':doc_id}),
        data=json.dumps(apts),
            content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        #response = new_client.generic(method="GET", path="/appointment/"+str(doc_id)+"/online/",
        #data=json.dumps({'date':'1400-02-14'}),content_type='application/json')
        response = client.get("/appointment/"+str(doc_id)+"/online/?date=1400-02-14")
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data[0]['duration'],20)

class InPersonAppointmentAPIViewTest(TestCase):
    
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

    def test_inperson_time(self):
        doc_id = DoctorUser.objects.get(user=self.user).id
        address_id = Address.objects.get(doc=self.doc).id
        apts = {
        "start_day": "1400-02-13",
        "end_day":"1400-02-17",
        "appointments": [
             {
                 "duration_number":"aaa",
                    "address_number":7,
                    "duration":20,
                    "doc_id":doc_id,
                    "address_id":address_id,
                    "time_type":"general",
                    "start_time":"19:00",
                    "end_time":"19:20"
             }
                        ]
            }
        #new_client = APIClient()
        response = client.post(reverse('inperson-apt',kwargs={'pk':doc_id }),
        data=json.dumps(apts),
            content_type='application/json')
        doc_str = str(doc_id)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        response = client.get("/appointment/"+str(doc_id)+"/in-person/?date=1400-02-14")
        #response = new_client.generic(method="GET", path="/appointment/"+str(doc_id)+"/in-person/",data=json.dumps({'date':'1400-02-14'}),content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data[0]['time_type'],"general")
    
class UpdateOnlineAppointmentAPIViewTest(TestCase):

    def setUp(self):
        self.Setup_doctor()
        self.Setup_appointments()
        self.Setup_user()
        apt = Appointment.objects.get(date='1400-02-14')
        apt.patient = self.user
        apt.save()

    def Setup_user(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(password)
        self.user.save()

    def Setup_doctor(self):
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

    def Setup_appointments(self):
        doc_id = DoctorUser.objects.get(user=self.doc_user).id
        apts = {
        "start_day": "1400-02-13",
        "end_day":"1400-02-17",
        "appointments": [
             {
                    "duration":20,
                    "doc_id":doc_id,
                    "start_time":"18:00",
                    "end_time":"18:20"
             }
                        ]
             }
        response = client.post(reverse('online-apt',kwargs={'pk':doc_id}),
        data=json.dumps(apts), content_type='application/json')

    def test_last_reserved_and_delete(self):
        doc_id = DoctorUser.objects.get(user=self.doc_user).id
        last_reserved_date = Appointment.objects.get(date='1400-02-14').date
        response = client.get(reverse('onapt-up',kwargs={'pk':doc_id}))

        #test last reserved time get
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['datetime'],str(last_reserved_date))

        #delete appointments after special day
        response = client.put(reverse('onapt-up',kwargs={'pk':doc_id}),data=json.dumps({'date':response.data['datetime']}),
                    content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),len(Appointment.objects.all()))

        #test get while no time reserved
        Appointment.objects.get(date='1400-02-14').delete()
        response = client.get(reverse('onapt-up',kwargs={'pk':doc_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],"No time reserved!")

        #delete all times
        response = client.delete(reverse('onapt-up',kwargs={'pk':doc_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],"all deleted!")

class UpdateInPersonAppointmentAPIViewTest(TestCase):

    def setUp(self):
        self.Setup_doctor()
        self.Setup_appointments()
        self.Setup_user()
        apt = Appointment.objects.get(date='1400-02-14')
        apt.patient = self.user
        apt.save()

    def Setup_user(self):
        username = 'testuser'
        email = 'testuser@gmail.com'
        first_name = 'Lucy'
        last_name = 'Brown'
        password = '123456'
        self.user = User(username=username,email=email,first_name=first_name,last_name=last_name,is_verified=True)
        self.user.set_password(password)
        self.user.save()

    def Setup_doctor(self):
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
        add = Address(doc=self.doc,state='Mazandaran',city='Sari',detail='Farhang St.')
        add.save() 

    def Setup_appointments(self):
        doc_id = DoctorUser.objects.get(user=self.doc_user).id
        address_id = Address.objects.get(doc=self.doc).id
        apts = {
        "start_day": "1400-02-13",
        "end_day":"1400-02-17",
        "appointments": [
             {
                 "duration_number":"aaa",
                    "address_number":7,
                    "duration":20,
                    "doc_id":doc_id,
                    "address_id":address_id,
                    "time_type":"general",
                    "start_time":"19:00",
                    "end_time":"19:20"
             }
                        ]
            }
        response = client.post(reverse('inperson-apt',kwargs={'pk':doc_id }),
        data=json.dumps(apts),content_type='application/json')

    def test_last_reserved_and_delete(self):
        doc_id = DoctorUser.objects.get(user=self.doc_user).id
        last_reserved_date = Appointment.objects.get(date='1400-02-14').date
        response = client.get("/update-appointment/"+str(doc_id)+"/in-person/?type=general")

        #test last reserved time get
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['datetime'],str(last_reserved_date))

        #delete appointments after special day
        response = client.put(reverse('inapt-up',kwargs={'pk':doc_id}),data=json.dumps({'date':response.data['datetime'],'type':"general"}),
                    content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),len(Appointment.objects.all()))

        #test get while no time reserved
        Appointment.objects.get(date='1400-02-14').delete()
        response = client.get(reverse('inapt-up',kwargs={'pk':doc_id}))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],"No time reserved!")

        #delete all times
        response = client.delete(reverse('inapt-up',kwargs={'pk':doc_id}),data=json.dumps({'type':"general"}),
                    content_type='application/json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],"all deleted!")

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
        add = Address(doc=self.doc,state='مازندران',city='Sari',detail='Farhang St.')
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
        add2 = Address(doc=self.doc2,state='مازندران',city='Sari',detail='Farhang St.')
        add2.save() 

    def test_search_by_state(self):

        response_search = client.get("/doctors?state=ماز",content_type='application/json')

        print(response_search)
        #test status code
        self.assertEqual(response_search.status_code,status.HTTP_200_OK)

        #test data
        self.assertEqual(2,len(response_search.data['doctors']))
        self.assertEqual(self.doc_user.first_name,response_search.data['doctors'][0]['user']['first_name'])
        self.assertEqual(self.doc_user2.first_name,response_search.data['doctors'][1]['user']['first_name'])

