from django.shortcuts import render,get_object_or_404,redirect
from rest_framework import generics, status, views, permissions,filters
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
from datetime import timedelta,datetime
import jdatetime
from django.db.models import Q

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
states["21"]="کرمانشاه"
states["22"]="کهگلویه و بویر احمد"
states["23"]="گلستان"
states["24"]="گیلان"
states["25"]="لرستان"
states["26"]="مازندران"
states["27"]="مرکزی"
states["28"]="هرمزگان"
states["29"]="همدان"
states["30"]="یزد"
    
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
        current_site = 'localhost:3000'
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
        user.is_doctor = True
        user.save()
        degree = request.data.get('degree')
        new_doc = DoctorUser(user=user,degree=degree)
        new_doc.save()
        token = RefreshToken.for_user(user).access_token
        current_site = 'localhost:3000'
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
            doc.state = states[add['state']]
            
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
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
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
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)

class FilterHomepageView(APIView):
    
    def get(self,request):
        filter = self.request.query_params.get('filter', None)

        if filter=='recent':
                    doc_list = DoctorUser.objects.order_by('-user')
                    serializer = DoctorProfileSerializer(doc_list,many=True)
                    return Response({"doctors" : serializer.data})

class DynamicSearchFilter(filters.SearchFilter):
    def get_search_fields(self, view, request):
        return request.GET.getlist('search-fields', [])

class DynamicDoctorAPIView(generics.ListCreateAPIView):
    filter_backends = (DynamicSearchFilter,)
    queryset = DoctorUser.objects.all()
    serializer_class = DoctorSerializer
    search_fields = ['first_name','last_name','specialty','state','city']

class OnlineAppointmentView(generics.GenericAPIView):
    serializer_class = OnlineAppointmentSerializer

    def get(self,request,pk):
        date = request.GET.get("date")
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,is_online=True,date=date)
        data = AppointmentSerializer(apts,many=True)
        return Response(data.data, status=status.HTTP_200_OK)

    def parse_date(self,date_str):
        date_arr = date_str.split('-')
        year = int(date_arr[0])
        month = int (date_arr[1])
        day = int(date_arr[2])
        return jdatetime.date(year,month,day)

    def post(self, request,pk):
        start_day = self.parse_date(request.data['start_day'])
        end_day = self.parse_date(request.data['end_day'])
        appointments = request.data['appointments']
        while start_day <= end_day:
            if ( Appointment.objects.filter(doctor=DoctorUser.objects.get(pk=pk),is_online=True,date=start_day).exists() ):
                Appointment.objects.filter(doctor=DoctorUser.objects.get(pk=pk),is_online=True,date=start_day).delete()
            for apt in appointments:
                apt['date_str'] = str(start_day)
                serializer = self.serializer_class(data=apt)
                serializer.is_valid(raise_exception=True)
            start_day = start_day + timedelta(days=1)
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,is_online=True)
        serializer = AppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class InPersonAppointmentView(generics.GenericAPIView):
    serializer_class = InPersonAppointmentSerializer

    def get(self, request, pk):
        date = request.GET.get("date")
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,is_online=False,date=date)
        data = AppointmentSerializer(apts,many=True)
        return Response(data.data, status=status.HTTP_200_OK)

    def parse_date(self,date_str):
        date_arr = date_str.split('-')
        year = int(date_arr[0])
        month = int (date_arr[1])
        day = int(date_arr[2])
        return jdatetime.date(year,month,day)

    def post(self, request, pk):
        start_day = self.parse_date(request.data['start_day'])
        end_day = self.parse_date(request.data['end_day'])
        appointments = request.data['appointments']
        while start_day <= end_day:
            if ( Appointment.objects.filter(doctor=DoctorUser.objects.get(pk=pk),is_online=False,date=start_day).exists() ):
                Appointment.objects.filter(doctor=DoctorUser.objects.get(pk=pk),is_online=False,date=start_day).delete()
            for apt in appointments:
                apt['date_str'] = str(start_day)
                serializer = self.serializer_class(data=apt)
                serializer.is_valid(raise_exception=True)
            start_day = start_day + timedelta(days=1)
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,is_online=False)
        serializer = AppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
            
class UpdateOnlineAppointmentView(generics.GenericAPIView):
    
    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,patient__isnull=False,is_online=True)
        apts = sorted(apts ,  key=lambda m: m.date)
        if len(apts) == 0:
            return Response({"message":"No time reserved!"},status=status.HTTP_200_OK)
        last_reserved = apts[len(apts) - 1 ].date
        data = { 'datetime' : str(last_reserved) }
        return Response(data, status=status.HTTP_200_OK)

    def put(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        Appointment.objects.filter(doctor=doc,patient__isnull=True,date__gt=request.data['date'],is_online=True).delete()
        apts = Appointment.objects.filter(doctor=doc,is_online=True)
        serializer = AppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        Appointment.objects.filter(doctor=doc,is_online=True).delete()
        return Response({"message":"all deleted!"},status=status.HTTP_200_OK)

class UpdateInPersonAppointmentView(generics.GenericAPIView):
    
    def get(self,request,pk):
        time_type = request.GET.get("type")
        doc = DoctorUser.objects.get(pk=pk)
        apts = Appointment.objects.filter(doctor=doc,patient__isnull=False,is_online=False,time_type=time_type)
        apts = sorted(apts ,  key=lambda m: m.date)
        if len(apts) == 0:
            return Response({"message":"No time reserved!"},status=status.HTTP_200_OK)
        last_reserved = apts[len(apts) - 1 ].date
        data = { 'datetime' : str(last_reserved) }
        return Response(data, status=status.HTTP_200_OK)

    def put(self,request,pk):
        time_type = request.data['type']
        doc = DoctorUser.objects.get(pk=pk)
        Appointment.objects.filter(doctor=doc,patient__isnull=True,date__gt=request.data['date'],is_online=False,time_type=time_type).delete()
        apts = Appointment.objects.filter(doctor=doc,is_online=False)
        serializer = AppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        time_type = request.GET.get("type")
        Appointment.objects.filter(doctor=doc,is_online=False,time_type=time_type).delete()
        return Response({"message":"all deleted!"},status=status.HTTP_200_OK)

class DurationAPIView(generics.GenericAPIView):

    def get(self,request,pk):
        durations = Duration.objects.filter(doctor=DoctorUser.objects.get(pk=pk))
        serializer = DurationSerializer(durations,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        duration = Duration(doctor=doc,time_type=request.data['time_type'],duration=request.data['duration'],duration_number=request.data['duration_number'])
        duration.save()
        serializer = DurationSerializer(duration)
        return Response(serializer.data,status=status.HTTP_200_OK)

class UpdateDurationAPIView(generics.GenericAPIView):

    def put(self,request,pk,doc_id):
        duration = Duration.objects.get(pk=pk)
        serializer = UpdateDurationSerializer(duration , data=request.data , partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data,status=status.HTTP_200_OK)

    def delete(self,request,pk,doc_id):
        Duration.objects.get(pk=pk).delete()
        return Response({'message':'successful!'},status=status.HTTP_200_OK)

class SearchDoctorView(generics.GenericAPIView):
    def get(self,request):
        search_fields = {}
        search_fields['state'] = self.request.query_params.get('state', None)
        search_fields['city'] = self.request.query_params.get('city', None)
        search_fields['first_name'] = self.request.query_params.get('first_name', None)
        search_fields['last_name'] = self.request.query_params.get('last_name', None)
        search_fields['specialty'] = self.request.query_params.get('specialty', None)

        search_models = [User,DoctorUser,Address]
        search_results = []
        for model in search_models:
            fields = []    
            if model is User:
                fields.append(model._meta.get_field('first_name'))
                fields.append(model._meta.get_field('last_name'))
            if model is DoctorUser:
                fields.append(model._meta.get_field('specialty'))
            if model is Address:
                fields.append(model._meta.get_field('city'))
                fields.append(model._meta.get_field('state'))
            search_queries=[]
            for x in fields:
                if search_fields[x.name] is not None:
                    search_queries.append(Q(**{x.name + "__contains" : search_fields[x.name]}))

            q_object = Q()
            if len(search_queries) != 0:
                q_object = q_object | search_queries[0]

            for query in search_queries:
                q_object = q_object & query
            
            if q_object is not None:
                results = model.objects.filter(q_object)
            
            if model is User:
                for r in results:
                    if r.is_doctor == True:
                        search_results.append(DoctorUser.objects.get(user=r))
            
            if model is DoctorUser:
                if len(search_results) !=0:
                    for r in search_results:
                        if r not in results:
                            search_results.remove(r)
                else:
                    for r in results:
                        search_results.append(r)
            
            if model is Address:
                docs=[]
                for a in results:
                    docs.append(a.doc)
                
                if len(search_results) !=0:
                    for r in search_results:
                        if not docs.__contains__(r):
                            search_results.remove(r)
                else:
                    for d in docs:
                        search_results.append(d)

        doctors = DoctorProfileSerializer(search_results,many=True).data

        if doctors == []:
            return Response({"message":"No doctors found","doctors":doctors})

        return Response({"message":"successfully found these doctors","doctors":doctors})

class DoctorPageInfoView(APIView):
    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        doctor = DoctorProfileSerializer(doc)
        return Response({"data":doctor.data,"message":"success"},status=status.HTTP_200_OK)

