# Generated by Django 4.2.6 on 2023-12-01 14:30

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("pet", "0002_rename_user_pet_account_remove_pet_body_status_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="pet",
            old_name="status",
            new_name="body_status",
        ),
    ]
