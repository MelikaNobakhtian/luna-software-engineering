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

states = {}
states["0"]="آذربایجان شرقی"
states["1"]="آذربایجان غربی"
states["2"]="اردبیل"
states["3"]="اصفهان"
states["4"]="البرز"
states["5"]="ایلام"
states["6"]="بوشهر"
states["7"]="تهران"
states["8"]="چهارمحال و بختیاری"
states["9"]="خراسان جنوبی"
states["10"]="خراسان رضوی"
states["11"]="خراسان شمالی"
states["12"]="خوزستان"
states["13"]="زنجان"
states["14"]="سمنان"
states["15"]="سیستان و بلوچستان"
states["16"]="فارس"
states["17"]="قزوین"
states["18"]="قم"
states["19"]="کردستان"
states["20"]="کرمان"
states["22"]="کرمانشاه"
states["23"]="کهگلویه و بویر احمد"
states["24"]="گلستان"
states["25"]="گیلان"
states["26"]="لرستان"
states["27"]="مازندران"
states["28"]="مرکزی"
states["29"]="هرمزگان"
states["30"]="همدان"
states["31"]="یزد"

class Check(APIView):
    def get(self,request):
        return Response(states)
        
class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
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
        data1 = request.data
        serializer = RegisterSerializer(data=data1)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data['email'])
        degree = request.data.get('degree')
        print(degree)
        print()
        new_doc = DoctorUser(user=user,degree=degree)
        new_doc.save()
        print('***********')
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
            return Response({'message': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError as identifier:
            return Response({'message': 'Activation Expired'}, status=status.HTTP_200_OK)
        except jwt.exceptions.DecodeError as identifier:
            return Response({'message': 'Invalid token'}, status=status.HTTP_200_OK)

class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({"data":serializer.data}, status=status.HTTP_200_OK)
        return Response({"message":serializer.errors}, status=status.HTTP_200_OK)

class DoctorProfileView(APIView):
    
    def get_object(self, pk):
        try:
            return DoctorUser.objects.get(pk=pk)
        except DoctorUser.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        docprofile = self.get_object(pk)
        serializer = DoctorProfileSerializer(docprofile)
        return Response({"data":serializer.data,"states":states},status=status.HTTP_200_OK)

class UpdateDoctorProfileView(generics.UpdateAPIView):
    serializer_class = UpdateDoctorProfileSerializer
    permission_classes = (IsAuthenticated,)
    queryset = DoctorUser.objects.all()

    def update(self,request,pk,*args,**kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        doc = get_object_or_404(queryset,pk=pk)
        self.check_object_permissions(self.request, doc)
        print(request)
        serializer = self.serializer_class(doc,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":serializer.data},status=status.HTTP_200_OK)
        return Response({'failure':True,'message':serializer.errors},status=status.HTTP_200_OK)

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
            return Response({"data":serializer.data},status=status.HTTP_200_OK)

        return Response({'failure':True},status=status.HTTP_200_OK)

class SetDoctorAddressView(APIView):

    def post(self,request,pk):
        
        doc = DoctorUser.objects.get(pk=pk)
        count = request.data.get("count")

        counter = 0
        while counter < count:
            add = request.data.get('addresses')[counter]
            new_add = Address(state=states[add['state']],doc=doc,city=add['city'],detail=add['detail'])
            new_add.save()
            counter+=1
            
        doc_add = Address.objects.filter(doc=doc)
        doc.save()
        add_list = AddressSerializer(doc_add,many=True)
        doc_info = DoctorProfileSerializer(doc)
        return Response({"message":"You submit your addresses successfully!","Doctor":doc_info.data},status=status.HTTP_200_OK)

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
                return Response({"message" : ["Wrong Password"]},status=status.HTTP_200_OK)
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                'status' : 'success',
                'message' : 'Password updated succesfully!',
            }

            return Response(response,status=status.HTTP_200_OK)

        return Response({"message":serializer.errors}, status=status.HTTP_200_OK)

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
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"data":serializer.data},status=status.HTTP_200_OK)
        return Response({'failure':serializer.errors},status=status.HTTP_200_OK)

class UserProfileView(APIView):

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    
    def get_object(self, pk):
        obj = get_object_or_404(self.queryset,pk=pk)
        return obj

    def get(self, request, pk, format=None):
        userprofile = self.get_object(pk)
        serializer = self.serializer_class(userprofile)
        return Response({"data":serializer.data},status=status.HTTP_200_OK)

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
            return Response({'message': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'There is no account with this email!'}, status=status.HTTP_200_OK)

class PasswordTokenCheckAPI(generics.GenericAPIView):

    def get(self, request, uidb64, token):

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user,token):
                    return Response({'message': 'Token is not valid, please request a new one'}, status=status.HTTP_200_OK)
            return Response({'success':True,'message':'Credentials Valid','uidb64':uidb64,'token':token},status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user,token):
                    return Response({'message': 'Token is not valid, please request a new one'}, status=status.HTTP_200_OK)
                    
            except UnboundLocalError as e:
                return Response({'message': 'Token is not valid, please request a new one'}, status=status.HTTP_200_OK)

class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)

class AdvancedSearchDoctorView(APIView):
    def get(self,request):
        doctors = DoctorUser.objects.all()
        search_fields = {}
        search_fields['state'] = self.request.query_params.get('state', None)
        search_fields['city'] = self.request.query_params.get('city', None)
        search_fields['first_name'] = self.request.query_params.get('first_name', None)
        search_fields['last_name'] = self.request.query_params.get('last_name', None)
        search_fields['specialty'] = self.request.query_params.get('specialty', None)
        # search_fields['sub_specialty'] = self.request.query_params.get('sub_specialty', None)

        print(search_fields)

        if search_fields['first_name'] is not None:
            user = User.objects.filter(first_name=search_fields['first_name'])
            doctors = doctors.filter(user=user,many=True)

#             Blog.objects.exclude(
#     entry__in=Entry.objects.filter(
#         headline__contains='Lennon',
#         pub_date__year=2008,
#     ),
# )

        # if search_fields['state'] is not None:
        #     print("**")
        doctors_list = DoctorProfileSerializer(doctors,many=True)
        if doctors is None:
            return Response({"message":"No doctors found","doctors":doctors_list.data})

        return Response({"message":"successfully found these doctors","doctors":doctors_list.data})