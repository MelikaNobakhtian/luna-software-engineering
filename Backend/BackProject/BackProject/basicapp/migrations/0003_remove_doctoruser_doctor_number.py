# Generated by Django 3.1.2 on 2021-04-09 19:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('basicapp', '0002_doctoruser_degree'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='doctoruser',
            name='doctor_number',
        ),
    ]
