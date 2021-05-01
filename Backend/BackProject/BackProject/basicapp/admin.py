from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(DoctorUser)
admin.site.register(Address)
admin.site.register(Appointment)