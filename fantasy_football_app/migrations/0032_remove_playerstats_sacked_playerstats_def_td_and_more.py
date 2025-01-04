# Generated by Django 4.2.9 on 2025-01-04 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0031_alter_rosteredplayers_roster_position'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playerstats',
            name='sacked',
        ),
        migrations.AddField(
            model_name='playerstats',
            name='def_td',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='defensive_fumbles_recovered',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='defensive_interceptions',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='defensive_sacks',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='fg_attempts',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='fg_made',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='half_ppr',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='long_fg',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='passing_yards_allowed_per_game',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='ppr',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='pts_allowed_per_game',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='rushing_yards_allowed_per_game',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='standard',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='total_yards_allowed_per_game',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='xp_attempts',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='xp_made',
            field=models.IntegerField(default=0),
        ),
    ]
