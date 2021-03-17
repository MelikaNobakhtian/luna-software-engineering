from django.core.mail import EmailMessage
import os
import environ

class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['email_subject'], body=data['email_body'], to=[data['to_email']])
        #print(env("EMAIL_HOST_USER"))
        email.send()