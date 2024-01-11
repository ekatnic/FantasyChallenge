import csv
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fantasy_football_project.settings')
django.setup()

from fantasy_football_app.models import Player, WeeklyStats
from fantasy_football_app.constants import input_indexes
from fantasy_football_app.scoring import calculate_weekly_score_for_player

def update_player_stats_from_csv(csv_file_path, stats_attribute):
    updated_player_stats = []
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        reader = csv.reader(csv_file)
        for row in reader:

            player_name = row[0].split('(')[0].strip()
            try:
                player = Player.objects.get(name=player_name)
            except Player.DoesNotExist:
                print(f'Player {player_name} does not exist')
                continue
            # Create or update the weekly stats instance
            create_or_update_weekly_stats_from_row(row, player, stats_attribute)


def create_or_update_weekly_stats_from_row(row, player, stats_attribute):
            try:
                weekly_stats = WeeklyStats.objects.get(player=player, week=stats_attribute)
            except WeeklyStats.DoesNotExist:
                weekly_stats = WeeklyStats(player=player, week=stats_attribute)
            stats_fields = input_indexes.keys()

            for field in stats_fields:
                value = row[input_indexes[field]]
                setattr(weekly_stats, field, 0 if value in ('', '0', '0.00') else int(float(value)))

            # Convert the weekly stats for that week to fantasy points
            weekly_stats.week_score = round(calculate_weekly_score_for_player(weekly_stats, player.position), 2)
            weekly_stats.save()

if __name__ == "__main__":
    stats_to_csv = {
        'WC': 'data/wild_card.csv',
        # 'CONF': 'data/conference.csv',
        # 'DIV': 'data/divisional.csv',
        # 'SB': 'data/super_bowl.csv',
    }
    for stats_attribute, csv_file_path in stats_to_csv.items():
        update_player_stats_from_csv(csv_file_path, stats_attribute)