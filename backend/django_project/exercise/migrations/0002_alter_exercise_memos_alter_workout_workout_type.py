# Generated by Django 4.2.6 on 2023-11-14 21:15

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("exercise", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="exercise",
            name="memos",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="workout",
            name="workout_type",
            field=models.CharField(
                choices=[
                    ("Aerobic", "Aerobic"),
                    ("Chest", "Chest"),
                    ("Shoulder", "Shoulder"),
                    ("Back", "Back"),
                    ("Leg", "Leg"),
                    ("Arm", "Arm"),
                    ("Abs", "Abs"),
                    ("Other", "Other"),
                ],
                max_length=20,
            ),
        ),
    ]
