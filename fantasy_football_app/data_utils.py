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


def create_or_update_weekly_stats_from_stats(stats, player, week):
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
        weekly_stats = WeeklyStats.objects.get(player=player, week=week)
    except WeeklyStats.DoesNotExist:
        weekly_stats = WeeklyStats(player=player, week=week)
    if player.position == 'DEF':
        process_defense_weekly_stat(weekly_stats, stats)
    else:
        process_offensive_weekly_stat(weekly_stats, stats)


def process_defense_weekly_stat(weekly_stats, stats):
    """
    This function processes a defensive WeeklyStats object for a given defense and week.

    Parameters:
    weekly_stats (WeeklyStats): A WeeklyStats object representing the defense for whom the stats are being updated.
    stats (dict): A dictionary representing the stats for a given week.

    Returns:
    None
    """
    weekly_stats.points_allowed = int(stats.get('ptsAllowed', 0))
    weekly_stats.fumbles_recovered = int(stats.get('fumblesRecovered', 0))
    weekly_stats.interceptions = int(stats.get('defensiveInterceptions', 0))
    weekly_stats.safeties = int(stats.get('safeties', 0))
    weekly_stats.sacks = int(stats.get('sacks', 0))
    weekly_stats.defensive_tds = int(stats.get('defTD', 0))
    # Convert the weekly stats for that week to fantasy points
    weekly_stats.save()

def process_offensive_weekly_stat(weekly_stats, stats):
    """
    This function processes an offensive WeeklyStats object for a given player and week.

    Parameters:
    weekly_stats (WeeklyStats): A WeeklyStats object representing the player for whom the stats are being updated.
    stats (dict): A dictionary representing the stats for a given week.

    Returns:
    None
    """
    passing_stats = stats.get('Passing', {})
    receiving_stats = stats.get('Receiving', {})
    rushing_stats = stats.get('Rushing', {})
    fumble_stats = stats.get('Defense', {})
    weekly_stats.passing_yards = int(passing_stats.get('passYds', 0))
    weekly_stats.passing_tds = int(passing_stats.get('passTD', 0))
    weekly_stats.passing_interceptions = int(passing_stats.get('int', 0))
    weekly_stats.rushing_yards = int(rushing_stats.get('rushYds', 0))
    weekly_stats.rushing_tds = int(rushing_stats.get('rushTD', 0))
    weekly_stats.receptions = int(receiving_stats.get('receptions', 0))
    weekly_stats.receiving_yards = int(receiving_stats.get('recYds', 0))
    weekly_stats.receiving_tds = int(receiving_stats.get('recTD', 0))
    weekly_stats.two_pt_conversions = (
        int(rushing_stats.get('rushingTwoPointConversion', 0)) + 
        int(receiving_stats.get('receivingTwoPointConversion', 0)) + 
        int(passing_stats.get('passingTwoPointConversion', 0))
    )
    weekly_stats.fumbles_lost = int(fumble_stats.get('fumblesLost', 0))

    # Convert the weekly stats for that week to fantasy points
    weekly_stats.save()
