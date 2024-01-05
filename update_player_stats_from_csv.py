import csv
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fantasy_football_project.settings')
django.setup()

from fantasy_football_app.models import PlayerStats, WeeklyStats

def update_player_stats_from_csv(csv_file_path, stats_attribute):
    updated_player_stats = []
    with open(csv_file_path, 'r') as csv_file:
        reader = csv.reader(csv_file)
        header = next(reader)
        for row in reader:
            player_name = row[0]
            player_stats = PlayerStats.objects.get(name=player_name)
            weekly_stats = WeeklyStats.objects.create(
                passing_yards=float(row[1]),
                passing_tds=float(row[2]),
                passing_interceptions=float(row[3]),
                rushing_yards=float(row[4]),
                rushing_tds=float(row[5]),
                receptions=float(row[6]),
                receiving_yards=float(row[7]),
                receiving_tds=float(row[8]),
                fumbles_lost=float(row[9]),
                sacks=float(row[10]),
                interceptions=float(row[11]),
                blocks=float(row[12]),
                safeties=float(row[13]),
                defensive_tds=float(row[14]),
                return_tds=float(row[15]),
                points_allowed=float(row[16]),
            )
            setattr(player_stats, stats_attribute, weekly_stats)
            player_stats.save()
            updated_player_stats.append(player_stats)
    return updated_player_stats

if __name__ == "__main__":
    stats_to_csv = {
        'wild_card_stats': 'data/wild_card.csv',
        'conference_stats': 'data/conference.csv',
        'divisional_stats': 'data/divisional.csv',
        'super_bowl_stats': 'data/super_bowl.csv',
    }
    for stats_attribute, csv_file_path in stats_to_csv.items():
        update_player_stats_from_csv(csv_file_path, stats_attribute)