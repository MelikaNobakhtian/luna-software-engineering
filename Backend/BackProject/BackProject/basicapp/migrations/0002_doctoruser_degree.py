# Generated by Django 3.1.2 on 2021-04-09 19:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('basicapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctoruser',
            name='degree',
            field=models.FileField(default='', upload_to='degrees/'),
        ),
    ]
