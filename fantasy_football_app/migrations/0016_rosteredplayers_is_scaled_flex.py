# Generated by Django 4.2.9 on 2024-01-12 01:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0015_remove_rosteredplayers_roster_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='rosteredplayers',
            name='is_scaled_flex',
            field=models.BooleanField(default=False),
        ),
    ]
