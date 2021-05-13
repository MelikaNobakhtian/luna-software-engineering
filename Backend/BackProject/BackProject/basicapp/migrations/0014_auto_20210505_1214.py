# Generated by Django 3.1.7 on 2021-05-05 12:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_jalali.db.models


class Migration(migrations.Migration):

    dependencies = [
        ('basicapp', '0013_auto_20210503_1224'),
    ]

    operations = [
        migrations.CreateModel(
            name='InPersonAppointment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', django_jalali.db.models.jDateField(null=True)),
                ('start_time', models.TimeField(null=True)),
                ('end_time', models.TimeField(null=True)),
                ('address_number', models.IntegerField(null=True)),
                ('address', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='basicapp.address')),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='basicapp.doctoruser')),
            ],
        ),
        migrations.CreateModel(
            name='OnlineAppointment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', django_jalali.db.models.jDateField(null=True)),
                ('start_time', models.TimeField(null=True)),
                ('end_time', models.TimeField(null=True)),
                ('duration', models.IntegerField()),
                ('duration_number', models.CharField(max_length=200)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='basicapp.doctoruser')),
                ('patient', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='duration',
            name='is_edited',
            field=models.BooleanField(default=False),
        ),
        migrations.DeleteModel(
            name='Appointment',
        ),
        migrations.AddField(
            model_name='inpersonappointment',
            name='duration',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='basicapp.duration'),
        ),
        migrations.AddField(
            model_name='inpersonappointment',
            name='patient',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
