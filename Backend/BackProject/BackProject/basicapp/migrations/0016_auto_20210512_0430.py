# Generated by Django 3.1.7 on 2021-05-12 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('basicapp', '0015_auto_20210511_1859'),
    ]

    operations = [
        migrations.AddField(
            model_name='onlineappointment',
            name='changed_time',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='onlineappointment',
            name='duration',
            field=models.IntegerField(),
        ),
    ]