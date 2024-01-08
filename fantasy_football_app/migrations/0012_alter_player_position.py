# Generated by Django 4.2.9 on 2024-01-06 04:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0011_standings'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='position',
            field=models.CharField(choices=[('QB', 'Quarterback'), ('RB', 'Running Back'), ('WR', 'Wide Receiver'), ('TE', 'Tight End'), ('K', 'Kicker'), ('DEF', 'Defense/Special Teams')], max_length=12),
        ),
    ]