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
from django.http import HttpResponsePermanentRedirect, response
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
from django.core.paginator import Paginator
from .pagination import PaginationHandlerMixin
from rest_framework.pagination import PageNumberPagination

states = {}
states["0"]="آذربایجان شرقی"
states["1"]="آذربایجان غربی"
states["2"]="اردبیل"
states["3"]="اصٝهان"
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
states["16"]="ٝارس"
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

specialties = {}
specialties["0"] = {"specialty":"پزشک عمومی","icon":'<LocalHospitalIcon></LocalHospitalIcon>'}
specialties["1"] = {"specialty":"چشم پزشکی","icon":'<VisibilityIcon></VisibilityIcon>'}
specialties["2"] = {"specialty":"دهان و دندان","icon":'<FaTeeth size="25"></FaTeeth>'}
specialties["3"] = {"specialty":"زنان و زایمان","icon":'<MdPregnantWoman size="35"></MdPregnantWoman>'}
specialties["4"] = {"specialty":"روانشناسی","icon":'<RiPsychotherapyLine size="35"></RiPsychotherapyLine>'}
specialties["5"] = {"specialty":"معده و گوارش","icon":'<GiStomach size="35"></GiStomach>'}
specialties["6"] = {"specialty":"پوست و مو و زیبایی","icon":'<MdFace size="35"></MdFace>'}
specialties["7"] = {"specialty":"کلیه و مجاری ادراری","icon":'<GiKidneys size="35"></GiKidneys>'}
specialties["8"] = {"specialty":"خون","icon":'<IoWater size="35"></IoWater>'}
specialties["9"] = {"specialty":"ارتوپدی","icon":'<LocalHospitalIcon></LocalHospitalIcon>'}
specialties["10"] = {"specialty":"قلب و عروق","icon":'<GiHeartOrgan size="40"></GiHeartOrgan>'}
specialties["11"] = {"specialty":"اطٝال","icon":'<ChildCareIcon></ChildCareIcon>'}
specialties["12"] = {"specialty":"غدد و دیابت","icon":'<LocalHospitalIcon></LocalHospitalIcon>'}
specialties["13"] = {"specialty":"عٝونی","icon":'<AiFillMedicineBox size="35"></AiFillMedicineBox>'}
specialties["14"] = {"specialty":"طب تسکینی و درد","icon":'<IoBandageOutline size="35"></IoBandageOutline>'}
specialties["15"] = {"specialty":"گوش حلق و بینی","icon":'<MdHearing size="35"></MdHearing>'}
specialties["16"] = {"specialty":"مغز و اعصاب","icon":'<GiBrain size="35"></GiBrain>'}
specialties["17"] = {"specialty":"داخلی","icon":'<IoBodyOutline size="35"></IoBodyOutline>'}
specialties["18"] = {"specialty":"روان پزشکی","icon":'<RiPsychotherapyLine size="35"></RiPsychotherapyLine>'}
specialties["19"] = {"specialty":"داروسازی","icon":'<GiMedicines size="35"></GiMedicines>'}
specialties["20"] = {"specialty":"جراحی","icon":'<RiSurgicalMaskFill size="35"></RiSurgicalMaskFill>'}
specialties["21"] = {"specialty":"تغذیه","icon":'<GiFruitBowl size="35"></GiFruitBowl>'}
specialties["22"] = {"specialty":"ٝیزیوتراپی","icon":'<GiArmSling size="35"></GiArmSling>'}
specialties["23"] = {"specialty":"رادیولوژی","icon":'<GiRadioactive size="30"></GiRadioactive>'}
specialties["24"] = {"specialty":"سونوگراٝی","icon":'<GiRadioactive size="30"></GiRadioactive>'}
specialties["25"] = {"specialty":"آزمایشگاه","icon":'<ImLab size="25"></ImLab>'}
specialties["26"] = {"specialty":"ریه","icon":'<RiLungsFill size="35"></RiLungsFill>'}
specialties["27"] = {"specialty":"ژنتیک","icon":'<SiMicrogenetics size="25"></SiMicrogenetics>'}
specialties["28"] = {"specialty":"توانبخشی","icon":'<MdAccessible size="35"></MdAccessible>'}
specialties["29"] = {"specialty":"طب سنتی","icon":'<GiTeapotLeaves size="35"></GiTeapotLeaves>'}
specialties["30"] = {"specialty":"استخوان و مٝاصل","icon":'<GiJoint size="35"></GiJoint>'}
specialties["31"] = {"specialty":"بیهوشی","icon":'<RiSurgicalMaskFill size="35"></RiSurgicalMaskFill>'}
specialties["32"] = {"specialty":"بینایی سنجی","icon":'<VisibilityIcon></VisibilityIcon>'}
specialties["33"] = {"specialty":"شنوایی سنجی","icon":'<MdHearing size="35"></MdHearing>'}
specialties["34"] = {"specialty":"آسیب شناسی","icon":'<FaUserInjured size="35"></FaUserInjured>'}
specialties["35"] = {"specialty":"سایر","icon":'<AiFillMedicineBox size="35"></AiFillMedicineBox>'}


class BasicPagination(PageNumberPagination):
    page_size_query_param = 'page_size'

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

class OnlineAppointmentView(generics.GenericAPIView):

    def get(self,request,pk):
        date = request.GET.get("date")
        doc = DoctorUser.objects.get(pk=pk)
        apts = OnlineAppointment.objects.filter(doctor=doc,date=date)
        serializer = OnlineAppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def parse_date(self,date_str):
        date_arr = date_str.split('-')
        year = int(date_arr[0])
        month = int (date_arr[1])
        day = int(date_arr[2])
        return jdatetime.date(year,month,day)

    def post(self, request,pk):
        apts = []
        start_day = self.parse_date(request.data['start_day'])
        end_day = self.parse_date(request.data['end_day'])
        appointments = request.data['appointments']
        while start_day <= end_day:
            for apt in appointments:
                apt['date_str'] = str(start_day)
                serializer = PostOnlineAppointmentSerializer(data=apt)
                serializer.is_valid(raise_exception=True)
                apts.append(serializer.validated_data)
            start_day = start_day + timedelta(days=1)
        serializer = OnlineAppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self,request,pk):
        idx = request.data['index']
        for index in idx:
            OnlineAppointment.objects.get(pk=index).delete()
        return Response({'message':'deleted!'},status=status.HTTP_200_OK)

class InPersonAppointmentView(generics.GenericAPIView):

    def get(self, request, pk):
        date = request.GET.get("date")
        doc = DoctorUser.objects.get(pk=pk)
        apts = InPersonAppointment.objects.filter(doctor=doc,date=date)
        serializer = InPersonAppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def parse_date(self,date_str):
        date_arr = date_str.split('-')
        year = int(date_arr[0])
        month = int (date_arr[1])
        day = int(date_arr[2])
        return jdatetime.date(year,month,day)

    def post(self, request, pk):
        apts = []
        start_day = self.parse_date(request.data['start_day'])
        end_day = self.parse_date(request.data['end_day'])
        appointments = request.data['appointments']
        while start_day <= end_day:
            for apt in appointments:
                apt['date_str'] = str(start_day)
                serializer = PostInPersonAppointmentSerializer(data=apt)
                serializer.is_valid(raise_exception=True)
                apts.append(serializer.validated_data)
            start_day = start_day + timedelta(days=1)
        serializer = InPersonAppointmentSerializer(apts,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self,request,pk):
        idx = request.data['index']
        for index in idx:
            InPersonAppointment.objects.get(pk=index).delete()
        return Response({'message':'deleted!'},status=status.HTTP_200_OK)
            
class DurationAPIView(APIView):

    def get(self,request,pk):
        durations = Duration.objects.filter(doctor=DoctorUser.objects.get(pk=pk),is_edited=False).exclude(time_type='online')
        serializer = DurationSerializer(durations,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        duration = Duration(doctor=doc,time_type=request.data['time_type'],duration=request.data['duration'],duration_number=request.data['duration_number'])
        duration.save()
        serializer = DurationSerializer(duration)
        return Response(serializer.data,status=status.HTTP_200_OK)

class OnlineDurationView(APIView):

    def get(self,request,pk):
        duration = Duration.objects.filter(doctor=DoctorUser.objects.get(pk=pk),is_edited=False,time_type='online')
        if len(duration) != 0:
            duration = duration[0]
            serializer = DurationSerializer(duration)
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response({'message':'No duration for online!'},status=status.HTTP_200_OK)

    def put(self,request,pk):
        doctor = DoctorUser.objects.get(pk=pk)
        duration = Duration.objects.get(doctor=doctor,is_edited=False,time_type='online')
        OnlineAppointment.objects.filter(doctor=doctor,duration=duration,patient__isnull=True).delete()
        duration.is_edited = True
        duration.save()
        new_duration = Duration(doctor=doctor,time_type=duration.time_type,duration_number=duration.duration_number,duration=request.data['duration'])
        new_duration.save()
        serializer = DurationSerializer(new_duration)
        return Response(serializer.data,status=status.HTTP_200_OK)

class UpdateDurationAPIView(generics.GenericAPIView):

    def put(self,request,pk,doc_id):
        if ( 'time_type' in request.data or 'duration' in request.data):
            duration = Duration.objects.get(pk=pk)
            InPersonAppointment.objects.filter(duration=duration,patient__isnull=True).delete()
            duration.is_edited = True
            duration.save()
            new_duration = Duration(doctor=DoctorUser.objects.get(pk=doc_id),time_type=duration.time_type,duration_number=duration.duration_number,duration=duration.duration)
        else:
            new_duration = Duration.objects.get(pk=pk)
        serializer = UpdateDurationSerializer(new_duration , data=request.data , partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data,status=status.HTTP_200_OK)

    def delete(self,request,pk,doc_id):
        duration = Duration.objects.get(pk=pk)
        apts = InPersonAppointment.objects.filter(duration=duration)
        for apt in apts:
            apt.delete()
        Duration.objects.get(pk=pk).delete()
        return Response({'message':'successful!'},status=status.HTTP_200_OK)

class ReservedAppointmentsAPIView(generics.GenericAPIView):

    def get(self,request,pk,doc_id):
        duration = Duration.objects.get(pk=pk)
        doc = DoctorUser.objects.get(pk=doc_id)
        if duration.time_type != 'online':
            apts = InPersonAppointment.objects.filter(doctor=doc,duration=duration,patient__isnull=False)
            if len(apts) == 0:
                return Response({'message':'No apt from this duration reserved!'},status=status.HTTP_200_OK)
            serializer = OnlineAppointmentSerializer(apts,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            apts = OnlineAppointment.objects.filter(doctor=doc,duration=duration,patient__isnull=False)
            if len(apts) == 0:
                return Response({'message':'No apt from this duration reserved!'},status=status.HTTP_200_OK)
            serializer = OnlineAppointmentSerializer(apts,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        
class SearchDoctorView(generics.GenericAPIView):
    def get(self,request):
        search_fields = {}
        search_fields['state'] = self.request.query_params.get('state', None)
        search_fields['city'] = self.request.query_params.get('city', None)
        search_fields['first_name'] = self.request.query_params.get('first_name', None)
        search_fields['last_name'] = self.request.query_params.get('last_name', None)
        search_fields['specialty'] = self.request.query_params.get('specialty', None)

        search_models = []
        if (search_fields['first_name'] is not None) or (search_fields['last_name'] is not None):
            search_models.append(User)
        if (search_fields['state'] is not None) or (search_fields['city'] is not None):
            search_models.append(Address)
        if (search_fields['specialty'] is not None):
            search_models.append(DoctorUser)
        if len(search_models) == 0:
            docs = DoctorUser.objects.all()
            doctors = DoctorProfileSerializer(docs,many=True)
            return Response({"message":"return all doctors","doctors":doctors.data})
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
                    if not docs.__contains__(a.doc):
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

class FilterBySpecialty(APIView):
    def get(self,request,pk):
        
        if DoctorUser.objects.filter(specialty=specialties[str(pk)]['specialty']).exists():
            doctors = DoctorUser.objects.filter(specialty=specialties[str(pk)]['specialty'])
            docs = DoctorProfileSerializer(doctors,many=True)
            return Response({"data":docs.data,"message":"success"})

        return Response({"message":"No doctors found"})
        
class SpecialtyView(APIView):
    def get(self,request):
        return Response(specialties)

class StateView(APIView):
    def get(self,request):
        return Response(states)

class DoctorPageCalendarOnlineView(APIView):

    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        date = self.request.query_params.get('date', None)
        dur = self.request.query_params.get('duration', None)

        online = OnlineAppointment.objects.all()

        if date is not None:
            online = online.filter(date=date,patient__isnull=True)
        if dur is not None:
            duration = Duration.objects.get(pk=dur)
            online = online.filter(duration=duration,patient__isnull=True)

        apt_online = OnlineAppointmentSerializer(online,many=True).data   

        if apt_online == []:
            return Response({"message":"No online appointments available"},status=status.HTTP_200_OK)

        return Response({"data":apt_online,"message":"success"},status=status.HTTP_200_OK)

class DoctorPageCalendarInPersonView(APIView):

    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        date = self.request.query_params.get('date', None)
        dur = self.request.query_params.get('duration', None)
        addr = self.request.query_params.get('address', None)
        
        inperson = InPersonAppointment.objects.all()

        if date is not None:
            inperson = inperson.filter(date=date,patient__isnull=True)
        if dur is not None:
            duration = Duration.objects.get(pk=dur)
            inperson = inperson.filter(duration=duration,patient__isnull=True)
        if addr is not None:
            address = Address.objects.get(pk=addr)
            inperson = inperson.filter(address=address,patient__isnull=True)

        apt_inperson = InPersonAppointmentSerializer(inperson,many=True).data

        if apt_inperson == [] :
            return Response({"message":"No inperson appointments available"},status=status.HTTP_200_OK)
            
        return Response({"data":apt_inperson,"message":"success"},status=status.HTTP_200_OK)

class UserTimeLineView(APIView):
    
    def get(self,request,pk):
        user = User.objects.get(pk=pk)
        inperson = InPersonAppointment.objects.filter(patient=user)
        online = OnlineAppointment.objects.filter(patient=user)
        apts = []
        apts.extend(inperson)
        apts.extend(online)
        sorted(apts,key=lambda x: x.start_time)
        sorted(apts,key=lambda x: x.date)
        user_apt = TimeLineSerializer(apts,many=True)
        return Response({"data":user_apt.data,"message":"success"})

class ReserveOnlineAppointmentAPIView(APIView):

    def post(self,request,doc_id,pk):
        user = request.user
        doc = DoctorUser.objects.get(pk=doc_id)
        apt = OnlineAppointment.objects.get(pk=pk)
        apt.patient = user
        apt.save()
        email_body = 'Hello ' + user.username + '!, \n You reserved an online appointemnt.Your appointment will be in ' + \
             str(apt.date) + ' at ' + str(apt.start_time) +' with doctor ' + doc.user.last_name + '.Remember this date!'
        data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reserve Online appointment'}
        Util.send_email(data)
        return Response({'message':'reserved!'},status=status.HTTP_200_OK)

    def put(self,request,doc_id,pk):
        user = request.user
        doc = DoctorUser.objects.get(pk=doc_id)
        apt = OnlineAppointment.objects.get(pk=pk)
        apt.patient = None
        apt.save()
        email_body = 'Hello ' + user.username + '!, \n You canceled an online appointemnt.Your appointment was in ' + \
             str(apt.date) + ' at ' + str(apt.start_time) +' with doctor ' + doc.user.last_name + '.'
        data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Cancel Online appointment'}
        Util.send_email(data)
        return Response({'message':'canceled!'},status=status.HTTP_200_OK)

class ReserveInPersonAppointmentAPIView(APIView):
    
    def post(self,request,doc_id,pk):
        user = request.user
        doc = DoctorUser.objects.get(pk=doc_id)
        apt = InPersonAppointment.objects.get(pk=pk)
        apt.patient = user
        apt.save()
        email_body = 'Hello ' + user.username + '!, \n You reserved an in person appointemnt.Your appointment will be in ' + \
             str(apt.date) + ' at ' + str(apt.start_time) +' with doctor ' + doc.user.last_name + '.Remember this date!'
        data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reserve in person appointment'}
        Util.send_email(data)
        return Response({'message':'reserved!'},status=status.HTTP_200_OK)

    def put(self,request,doc_id,pk):
        user = request.user
        doc = DoctorUser.objects.get(pk=doc_id)
        apt = InPersonAppointment.objects.get(pk=pk)
        apt.patient = None
        apt.save()
        email_body = 'Hello ' + user.username + '!, \n You canceled an in person appointemnt.Your appointment was in ' + \
             str(apt.date) + ' at ' + str(apt.start_time) +' with doctor ' + doc.user.last_name + '.'
        data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Cancel in person appointment'}
        Util.send_email(data)
        return Response({'message':'canceled!'},status=status.HTTP_200_OK)

class DoctorTodayTimeLineView(APIView):

    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)
        inperson = InPersonAppointment.objects.filter(doctor=doc,date=jdatetime.date.today(),patient__isnull=False)
        online = OnlineAppointment.objects.filter(doctor=doc,date=jdatetime.date.today(),patient__isnull=False)
        apts = []
        apts.extend(inperson)
        apts.extend(online)
        sorted(apts,key=lambda x: x.start_time)
        doc_apt = TimeLineSerializer(apts,many=True)
        if doc_apt == []:
            return Response({"message":"No appointments"})
        return Response({"data":doc_apt.data,"message":"success"})

class DoctorTomorrowTimeLineView(APIView):

    def get(self,request,pk):
        doc = DoctorUser.objects.get(pk=pk)

        date = jdatetime.date.today()
        tomorrow = date + timedelta(days=1)

        inperson = InPersonAppointment.objects.filter(doctor=doc,date=tomorrow,patient__isnull=False)
        online = OnlineAppointment.objects.filter(doctor=doc,date=tomorrow,patient__isnull=False)
        apts = []
        apts.extend(inperson)
        apts.extend(online)
        sorted(apts,key=lambda x: x.start_time)
        doc_apt = TimeLineSerializer(apts,many=True)
        if doc_apt == []:
            return Response({"message":"No appointments"})
        return Response({"data":doc_apt.data,"message":"success"})
        
class MessagesModelList(APIView,PaginationHandlerMixin):

    pagination_class = BasicPagination

    def get(self,request,dialog_with=None):
        user = request.user
        user2_id = dialog_with
        if user2_id is not None:
            user2 = User.objects.get(pk=user2_id)
            qs = MessageModel.objects \
                    .filter(Q(recipient=user, sender=user2) |
                            Q(sender=user, recipient=user2)) \
                    .select_related('sender', 'recipient')
        else:
            qs = MessageModel.objects.filter(Q(recipient=user) |
                                             Q(sender=user)).prefetch_related('sender', 'recipient')
        qs = qs.order_by('-created')
        qs_paginate = self.paginate_queryset(qs)
        #print(qs_paginate)
        serializer = MessageSerializer(qs,context={"user_pk":user.id},many=True)
        count = Paginator(qs,100).num_pages
        return Response({'count':count,'messages':serializer.data},status=status.HTTP_200_OK)

class DialogsModelList(APIView,PaginationHandlerMixin):

    pagination_class = BasicPagination
    model = DialogsModel

    def get(self,request):
        user = request.user
        qs = DialogsModel.objects.filter(Q(user1_id=user.id) | Q(user2_id=user.id)) \
            .select_related('user1', 'user2')
        qs = qs.order_by('-created')
        #qs_paginate = self.paginate_queryset(qs)
        serializer = DialogSerializer(qs,context={'user_pk':user.id},many=True)
        count = Paginator(qs,20).num_pages
        return Response({'count':count,'dialogs':serializer.data},status=status.HTTP_200_OK)

