from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(DoctorUser)
admin.site.register(Address)
admin.site.register(OnlineAppointment)
admin.site.register(InPersonAppointment)
admin.site.register(Duration)
admin.site.register(MessageModel)
admin.site.register(DialogsModel)
admin.site.register(Comment)