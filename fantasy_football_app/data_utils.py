import csv

from django.core.cache import cache

from .constants import INPUT_INDEXES
from .models import Player, WeeklyStats


def create_or_update_weekly_stats_from_row(row, player, stats_attribute):
    """
    This function creates or updates a WeeklyStats object for a given player and week.

    Parameters:
    row (list): A list representing a row of data from the CSV file.
    player (Player): A Player object representing the player for whom the stats are being updated.
    stats_attribute (str): A string representing the week for which the stats are being updated.

    Returns:
    None
    """
    try:
        weekly_stats = WeeklyStats.objects.get(player=player, week=stats_attribute)
    except WeeklyStats.DoesNotExist:
        weekly_stats = WeeklyStats(player=player, week=stats_attribute)
    stats_fields = INPUT_INDEXES.keys()

    for field in stats_fields:
        value = row[INPUT_INDEXES[field]]
        setattr(weekly_stats, field, 0 if value in ('', '0', '0.00') else int(float(value)))

    # Convert the weekly stats for that week to fantasy points
    weekly_stats.save()

def update_player_stats_from_csv(csv_file_path, stats_attribute):
    """
    This function updates player's Weekly Stats from a given CSV file.

    Parameters:
    csv_file_path (str): The path to the CSV file containing the player stats.
    stats_attribute (str): A string representing the week for which the stats are being updated.

    Returns:
    None
    """
    updated_player_stats = []
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        reader = csv.reader(csv_file)
        cache.delete('ranked_entries_dict')
        cache.delete('players_scoring_dict')
        for row in reader:
            player_name = row[0].split('(')[0].strip()
            try:
                player = Player.objects.get(name=player_name)
            except Player.DoesNotExist:
                print(f'Player {player_name} does not exist')
                continue
            # Create or update the weekly stats instance
            create_or_update_weekly_stats_from_row(row, player, stats_attribute)
