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
from rest_framework.permissions import IsAuthenticated
import os


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
        current_site = get_current_site(request).domain
        relativeLink = reverse('email-verify')
        absurl = 'http://'+current_site+relativeLink+"?token="+str(token)
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
        current_site = get_current_site(request).domain
        relativeLink = reverse('email-verify')
        absurl = 'http://'+current_site+relativeLink+"?token="+str(token)
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
        return Response({'failure':True},status=status.HTTP_400_BAD_REQUEST)

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
        print(request.data)
        print(count)
        counter = 0
        while counter < count:
            add = request.data.get('addresses')[counter]
            print("+++++++++++++++")
            print(add)
            new_add = Address(state=add['state'],doc=doc,city=add['city'],detail=add['detail'])
            new_add.save()
            counter+=1
        #doc_add = Address.objects.filter(doc=doc)
        #add_list = AddressSerializer(doc_add,many=True)
        #doc_info = DoctorProfileSerializer(doc)
        return Response({"message":"You submit your addresses successfully!"})
       