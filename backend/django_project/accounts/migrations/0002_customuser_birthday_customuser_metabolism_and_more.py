# Generated by Django 4.2.7 on 2023-11-09 03:58

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="birthday",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="customuser",
            name="metabolism",
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name="customuser",
            name="picture",
            field=models.ImageField(
                blank=True, null=True, upload_to="profile_pictures/"
            ),
        ),
        migrations.AddField(
            model_name="customuser",
            name="sex",
            field=models.BooleanField(default=False),
        ),
    ]