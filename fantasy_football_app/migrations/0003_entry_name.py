# Generated by Django 5.0 on 2023-12-31 03:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0002_alter_player_position_entry'),
    ]

    operations = [
        migrations.AddField(
            model_name='entry',
            name='name',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
