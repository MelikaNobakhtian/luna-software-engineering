# Generated by Django 3.1.2 on 2021-04-30 22:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('basicapp', '0010_auto_20210429_1919'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctoruser',
            name='city',
            field=models.CharField(default='unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='doctoruser',
            name='first_name',
            field=models.CharField(default='unknown', max_length=50),
        ),
        migrations.AddField(
            model_name='doctoruser',
            name='last_name',
            field=models.CharField(default='unknown', max_length=100),
        ),
        migrations.AddField(
            model_name='doctoruser',
            name='state',
            field=models.CharField(default='unknown', max_length=255),
        ),
    ]
