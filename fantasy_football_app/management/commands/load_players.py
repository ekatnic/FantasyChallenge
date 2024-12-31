from django.core.management.base import BaseCommand
from fantasy_football_app.models import Player, PlayerInfo, PlayerStats
from django.core.cache import cache
import csv
from datetime import datetime

class Command(BaseCommand):
    help = 'Load players from CSV file'

    def handle(self, *args, **options):
        # delete old players data like before
        Player.objects.all().delete()
        PlayerInfo.objects.all().delete()
        PlayerStats.objects.all().delete()
        cache.delete('ranked_entries_dict')
        cache.delete('players_scoring_dict')

        with open('data/players.csv', 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                player, _ = Player.objects.get_or_create(
                    name=row['name'],
                    position=row['position'],
                    team=row['team']
                )

                PlayerInfo.objects.update_or_create(
                    player=player,
                    defaults={
                        'birthdate': datetime.strptime(row['birthdate'], '%Y-%m-%d').date() if row.get('birthdate') else None,
                        'height': row.get('height'),
                        'weight': row.get('weight'),
                        'school': row.get('school'),
                        'image': row.get('image')
                    }
                )

                PlayerStats.objects.create(
                    player=player,
                    season=int(row['season']),
                    season_type=row.get('season_type'),
                    rushing_yards_avg=float(row.get('rushing_yards_avg', 0.0)),
                    rushing_yards=int(row.get('rushing_yards', 0)),
                    carries=int(row.get('carries', 0)),
                    long_rush=int(row.get('long_rush', 0)),
                    rushing_tds=int(row.get('rushing_tds', 0)),
                    receptions=int(row.get('receptions', 0)),
                    receiving_tds=int(row.get('receiving_tds', 0)),
                    long_rec=int(row.get('long_rec', 0)),
                    targets=int(row.get('targets', 0)),
                    receiving_yards=int(row.get('receiving_yards', 0)),
                    receiving_yards_avg=float(row.get('receiving_yards_avg', 0.0)),
                    pass_attempts=int(row.get('pass_attempts', 0)),
                    passing_tds=int(row.get('passing_tds', 0)),
                    passing_yards=int(row.get('passing_yards', 0)),
                    interceptions=int(row.get('interceptions', 0)),
                    pass_completions=int(row.get('pass_completions', 0)),
                    passing_yards_avg=float(row.get('passing_yards_avg', 0.0)),
                    qbr=float(row.get('qbr', 0.0)),
                    sacked=int(row.get('sacked', 0)),
                    rating=float(row.get('rating', 0.0)),
                    fumbles=int(row.get('fumbles', 0)),
                    fumbles_lost=int(row.get('fumbles_lost', 0)),
                    fumbles_recovered=int(row.get('fumbles_recovered', 0)),
                )