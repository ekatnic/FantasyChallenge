# Generated by Django 5.0 on 2023-12-31 06:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0004_playerstats'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='playerstats',
            unique_together=set(),
        ),
    ]
