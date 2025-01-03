# Generated by Django 4.2.9 on 2024-12-30 23:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fantasy_football_app', '0027_entry_year'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlayerStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('season', models.IntegerField()),
                ('season_type', models.CharField(blank=True, choices=[('regular_season', 'Regular Season'), ('pre_season', 'Pre-Season'), ('post_season', 'Post-Season')], max_length=50, null=True)),
                ('rushing_yards_avg', models.FloatField(default=0.0)),
                ('rushing_yards', models.IntegerField(default=0)),
                ('carries', models.IntegerField(default=0)),
                ('long_rush', models.IntegerField(default=0)),
                ('rushing_tds', models.IntegerField(default=0)),
                ('receptions', models.IntegerField(default=0)),
                ('receiving_tds', models.IntegerField(default=0)),
                ('long_rec', models.IntegerField(default=0)),
                ('targets', models.IntegerField(default=0)),
                ('receiving_yards', models.IntegerField(default=0)),
                ('receiving_yards_avg', models.FloatField(default=0.0)),
                ('pass_attempts', models.IntegerField(default=0)),
                ('passing_tds', models.IntegerField(default=0)),
                ('passing_yards', models.IntegerField(default=0)),
                ('interceptions', models.IntegerField(default=0)),
                ('pass_completions', models.IntegerField(default=0)),
                ('passing_yards_avg', models.FloatField(default=0.0)),
                ('qbr', models.FloatField(default=0.0)),
                ('sacked', models.IntegerField(default=0)),
                ('rating', models.FloatField(default=0.0)),
                ('fumbles', models.IntegerField(default=0)),
                ('fumbles_lost', models.IntegerField(default=0)),
                ('fumbles_recovered', models.IntegerField(default=0)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stats', to='fantasy_football_app.player')),
            ],
        ),
        migrations.CreateModel(
            name='PlayerInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('birthdate', models.DateField(blank=True, null=True)),
                ('height', models.CharField(blank=True, max_length=20, null=True)),
                ('weight', models.CharField(blank=True, max_length=20, null=True)),
                ('school', models.CharField(blank=True, max_length=100, null=True)),
                ('player', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='info', to='fantasy_football_app.player')),
            ],
        ),
    ]
