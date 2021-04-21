from django.shortcuts import render,get_object_or_404,redirect
from rest_framework import generics, status, views, permissions
from .serializers import *
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
import jwt
from django.conf import settings
from django.http import HttpResponsePermanentRedirect
import os
from rest_framework.permissions import IsAuthenticated
#from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.parsers import JSONParser

class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data['email'])
        token = RefreshToken.for_user(user).access_token
        #current_site = get_current_site(request).domain
        current_site = 'localhost:3000'
        #relativeLink = reverse('verification')
        absurl = 'http://'+current_site+"/verification/"+str(token)
        email_body = 'Hi '+user.username + \
            ' Use the link below to verify your email \n' + absurl
        data = {'email_body': email_body, 'to_email': user.email,
                'email_subject': 'Verify your email'}

        Util.send_email(data)
        return Response(user_data, status=status.HTTP_201_CREATED)

class RegisterDoctorView(generics.GenericAPIView):

    def post(self, request):
        user = request.data
        serializer = RegisterSerializer(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data['email'])
        new_doc = DoctorUser(user=user,degree=request.FILES['degree'])
        new_doc.save()
        token = RefreshToken.for_user(user).access_token
        #current_site = get_current_site(request).domain
        current_site = 'localhost:3000'
        #relativeLink = reverse('verification')
        absurl = 'http://'+current_site+"/verification/"+str(token)
        email_body = 'Hi '+user.first_name+' '+user.last_name + \
            ' Use the link below to verify your email \n' + absurl
        data = {'email_body': email_body, 'to_email': user.email,
                'email_subject': 'Verify your email'}

        Util.send_email(data)
        user_data['degree']=new_doc.degree
        return Response(user_data, status=status.HTTP_201_CREATED)

class VerifyEmail(views.APIView):

    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DoctorProfileView(APIView):
    
    def get_object(self, pk):
        try:
            return DoctorUser.objects.get(pk=pk)
        except DoctorUser.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        docprofile = self.get_object(pk)
        serializer = DoctorProfileSerializer(docprofile)
        return Response(serializer.data)

class UpdateDoctorProfileView(generics.UpdateAPIView):
    serializer_class = UpdateDoctorProfileSerializer
    permission_classes = (IsAuthenticated,)
    queryset = DoctorUser.objects.all()

    def update(self,request,pk,*args,**kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        doc = get_object_or_404(queryset,pk=pk)
        self.check_object_permissions(self.request, doc)

        serializer = self.serializer_class(doc,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'failure':True,'message':serializer.errors},status=status.HTTP_400_BAD_REQUEST)

class UpdateDoctorAddressView(generics.UpdateAPIView):
    serializer_class = UpdateDoctorAddressSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Address.objects.all()

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset,pk=self.request.user.id)
        self.check_object_permissions(self.request, obj)
        return obj

    def update(self,request,doc_pk,add_pk,*args,**kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        address = get_object_or_404(queryset,pk=add_pk)
        doc = DoctorUser.objects.get(pk=doc_pk)
        self.check_object_permissions(self.request, doc)

        serializer = self.serializer_class(address,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'failure':True},status=status.HTTP_400_BAD_REQUEST)

class SetDoctorAddressView(APIView):

    def post(self,request,pk):
        
        doc = DoctorUser.objects.get(pk=pk)
        count = request.data.get("count")

        counter = 0
        while counter < count:
            add = request.data.get('addresses')[counter]
            new_add = Address(state=add['state'],doc=doc,city=add['city'],detail=add['detail'])
            new_add.save()
            counter+=1
            
        doc_add = Address.objects.filter(doc=doc)
        doc.save()
        add_list = AddressSerializer(doc_add,many=True)
        doc_info = DoctorProfileSerializer(doc)
        return Response({"message":"You submit your addresses successfully!","Doctor":doc_info.data})

class ChangePasswordView(generics.UpdateAPIView):

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self,queryset=None):
        obj = self.request.user
        return obj

    def update(self,request,pk,*args,**kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password" : ["Wrong Password"]},status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status' : 'success',
                'message' : 'Password updated succesfully!',
            }

            return Response(response,status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserProfileView(generics.UpdateAPIView):
    serializer_class = UpdateUserProfileSerializer
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset,pk=self.request.user.id)
        self.check_object_permissions(self.request, obj)
        return obj

    def update(self,request,pk,*args,**kwargs):
        user = self.get_object()
        serializer = self.serializer_class(user,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'failure':serializer.errors},status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    
    def get_object(self, pk):
        obj = get_object_or_404(self.queryset,pk=pk)
        return obj

    def get(self, request, pk, format=None):
        userprofile = self.get_object(pk)
        serializer = self.serializer_class(userprofile)
        return Response(serializer.data)

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email', '')
        print(email)
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            # current_site = get_current_site(
            #     request=request).domain
            # relativeLink = reverse(
            #     'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            absurl = 'http://localhost:3000/forgotpassword/' + uidb64 +'/'+token
            email_body = 'Hello, \n Use link below to reset your password  \n' + \
                absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your passsword'}
            Util.send_email(data)
            return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        else:
            return Response({'failure': 'There is no account with this email!'}, status=status.HTTP_404_NOT_FOUND)

class PasswordTokenCheckAPI(generics.GenericAPIView):

    def get(self, request, uidb64, token):

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user,token):
                    return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'success':True,'message':'Credentials Valid','uidb64':uidb64,'token':token},status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user,token):
                    return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)
                    
            except UnboundLocalError as e:
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)

class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)

class OnlineAppointmentView(generics.GenericAPIView):
    serializer_class = OnlineAppointmentSerializer

    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc)
        data = AppointmentSerializer(apts,many=True)
        return Response(data.data, status=status.HTTP_200_OK)

    def post(self, request,pk):
        serializer = self.serializer_class(data=request.data,many=True)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class InPersonAppointmentView(generics.GenericAPIView):
    serializer_class = InPersonAppointmentSerializer

    def get(self,request, doc_id):
        doc = DoctorUser.objects.get(pk=doc_id)
        apts = Appointment.objects.filter(doctor=doc,is_online=False)
        data = AppointmentSerializer(apts,many=True)
        return Response(data.data, status=status.HTTP_200_OK)

    def post(self, request, doc_id):
        serializer = self.serializer_class(data=request.data,many=True)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateOnlineAppointmentView(generics.GenericAPIView):
    
    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,patient__isnull=False,is_online=True)
        apts = sorted(apts ,  key=lambda m: m.start_datetime)
        if len(apts) == 0:
            return Response({"message":"No time reserved!"},status=status.HTTP_200_OK)
        last_reserved = apts[len(apts) - 1 ].start_datetime
        data = { 'datetime' : str(last_reserved) }
        return Response(data, status=status.HTTP_200_OK)

    def put(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        Appointment.objects.filter(doctor=doc,patient__isnull=True,start_datetime__gt=request.data['date'],is_online=True).delete()
        apts = Appointment.objects.filter(doctor=doc,is_online=True)
        serializer = AppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        Appointment.objects.filter(doctor=doc,is_online=True).delete()
        return Response({"message":"all deleted!"},status=status.HTTP_200_OK)


class UpdateInPersonAppointmentView(generics.GenericAPIView):
    
    def get(self,request,pk):
        time_type = request.data['type']
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,patient__isnull=False,is_online=False,time_type=time_type)
        apts = sorted(apts ,  key=lambda m: m.start_datetime)
        if len(apts) == 0:
            return Response({"message":"No time reserved!"},status=status.HTTP_200_OK)
        last_reserved = apts[len(apts) - 1 ].start_datetime
        data = { 'datetime' : str(last_reserved) }
        return Response(data, status=status.HTTP_200_OK)

    def put(self,request,pk):
        time_type = request.data['type']
        doc = DoctorUser.objects.get(pk=pk)
        Appointment.objects.filter(doctor=doc,patient__isnull=True,start_datetime__gt=request.data['date'],is_online=False,time_type=time_type).delete()
        apts = Appointment.objects.filter(doctor=doc,is_online=False)
        serializer = AppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        Appointment.objects.filter(doctor=doc,is_online=False,time_type=request.data['type']).delete()
        return Response({"message":"all deleted!"},status=status.HTTP_200_OK)





