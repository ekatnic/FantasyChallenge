# Generated by Django 5.0 on 2023-12-31 07:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0005_alter_playerstats_unique_together'),
    ]

    operations = [
        migrations.CreateModel(
            name='WeeklyStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('passing_yards', models.IntegerField(default=0)),
                ('passing_tds', models.IntegerField(default=0)),
                ('passing_interceptions', models.IntegerField(default=0)),
                ('rushing_yards', models.IntegerField(default=0)),
                ('rushing_tds', models.IntegerField(default=0)),
                ('receptions', models.IntegerField(default=0)),
                ('fumbles_lost', models.IntegerField(default=0)),
                ('sacks', models.IntegerField(default=0)),
                ('interceptions', models.IntegerField(default=0)),
                ('blocks', models.IntegerField(default=0)),
                ('safeties', models.IntegerField(default=0)),
                ('defensive_tds', models.IntegerField(default=0)),
                ('return_tds', models.IntegerField(default=0)),
                ('week_score', models.IntegerField(default=0)),
            ],
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='blocks',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='conference_score',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='defensive_tds',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='divisional_score',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='fumbles_lost',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='interceptions',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='passing_interceptions',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='passing_tds',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='passing_yards',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='receptions',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='return_tds',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='rushing_tds',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='rushing_yards',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='sacks',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='safeties',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='super_bowl_score',
        ),
        migrations.RemoveField(
            model_name='playerstats',
            name='wild_card_score',
        ),
        migrations.AlterField(
            model_name='playerstats',
            name='position',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='playerstats',
            name='team',
            field=models.CharField(max_length=100),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='conference_stats',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conference', to='fantasy_football_app.weeklystats'),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='divisional_stats',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='divisional', to='fantasy_football_app.weeklystats'),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='super_bowl_stats',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='super_bowl', to='fantasy_football_app.weeklystats'),
        ),
        migrations.AddField(
            model_name='playerstats',
            name='wild_card_stats',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='wild_card', to='fantasy_football_app.weeklystats'),
        ),
    ]
