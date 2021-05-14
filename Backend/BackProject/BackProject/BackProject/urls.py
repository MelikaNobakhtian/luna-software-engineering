"""BackProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from basicapp.views import *
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name="register"),
    path('register-doctor/', RegisterDoctorView.as_view(), name="register-doctor"),
    path('email-verify/', VerifyEmail.as_view(), name="email-verify"),
    path('login/', LoginAPIView.as_view(), name="login"),
    path('doctor/<int:pk>/',DoctorProfileView.as_view(), name="doctor-profile"),
    path('doctor/<int:pk>/update-profile/',UpdateDoctorProfileView.as_view(), name="update-doctor-profile"),
    path('doctor/<doc_pk>/update-address/<add_pk>/',UpdateDoctorAddressView.as_view(), name="update-doctor-address"),
    path('doctor/<int:pk>/set-address/',SetDoctorAddressView.as_view(), name="set-doctor-address"),
    path('user/<int:pk>/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user/<int:pk>/update-profile/', UpdateUserProfileView.as_view(), name='update-profile'),
    path('user/<int:pk>/',UserProfileView.as_view(),name='user-profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('password-reset/<uidb64>/<token>/',
         PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(),
         name='password-reset-complete'),
    path('home/',FilterHomepageView.as_view(),name="filter recently joined doctors"),
    path('doctors',SearchDoctorView.as_view(),name="search doctor"),
    path('doctor-info/<int:pk>/',DoctorPageInfoView.as_view(), name="doctor-page-info"),
    path('doctor/<int:pk>/duration/',DurationAPIView.as_view(),name="duration"),
    path('doctor/<int:doc_id>/update-duration/<int:pk>/',UpdateDurationAPIView.as_view(),name="update-duration"),
    path('doctor/<int:pk>/online-appointment/',OnlineAppointmentView.as_view(),name="online-apt"),
    path('doctor/<int:pk>/inperson-appointment/',InPersonAppointmentView.as_view(),name="inperson-apt"),
    path('doctor/<int:pk>/online-duration/',OnlineDurationView.as_view(),name="online-duration"),
    path('doctor/<int:doc_id>/reserved/<int:pk>/',ReservedAppointmentsAPIView.as_view(),name="reserved"),
    path('home/filterbyspecialty/<int:pk>/',FilterBySpecialty.as_view(), name='filter-by-specialty'),
    path('specialties/',SpecialtyView.as_view(),name='get-specialties'),
    path('states/',StateView.as_view(),name='get-states'),
    
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)