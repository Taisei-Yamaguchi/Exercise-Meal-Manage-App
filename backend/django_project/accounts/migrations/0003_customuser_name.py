# Generated by Django 4.2.6 on 2023-11-09 07:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_customuser_birthday_customuser_metabolism_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="name",
            field=models.CharField(default="unkown", max_length=100),
        ),
    ]
