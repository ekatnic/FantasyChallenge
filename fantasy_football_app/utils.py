import csv

from django.db.models import Prefetch
from django.core.cache import cache
from .constants import INPUT_INDEXES
from .scoring import get_scaled_player_scoring_dict
from .models import Entry, Player, WeeklyStats

def get_all_entry_score_dicts():
    """
    Get a dictionary of total scores for each entry in db
    Returns:
        dict: A dictionary where the keys are entries and the values are dicts of their total scores.
    """
    # Try to get the result from the cache
    all_entry_score_dict = cache.get('all_entry_score_dicts')

    # If the result was not in the cache, calculate it and store it in the cache
    if all_entry_score_dict is None:
        entries = Entry.objects.prefetch_related('rosteredplayers_set__player__weeklystats_set').all().order_by('id')
        all_entry_score_dict = get_entry_list_score_dict(entries)
        all_entry_score_dict = sorted(all_entry_score_dict.items(), key=lambda item: item[1]['total'], reverse=True)
        cache.set('all_entry_score_dicts', all_entry_score_dict, 60 * 30)  # Cache results for 30 minutes

    return all_entry_score_dict

def get_entry_list_score_dict(entry_list):
    """
    Get a dictionary of total scores for each entry in a list.

    Args:
        entry_list (list): The list of entries to get scores for.

    Returns:
        dict: A dictionary where the keys are entries and the values are dicts of their total scores.
    """
    return {entry: get_entry_total_dict(get_entry_score_dict(entry)) for entry in entry_list}

def get_entry_score_dict(entry):
    """
    Get a dictionary of scores for each player in an entry.

    Args:
        entry (Entry): The entry to get scores for.

    Returns:
        dict: A dictionary where the keys are players and the values are dicts of their scores.
    """
    entry_score_dict = {}
    rostered_player_list = entry.rosteredplayers_set.all().order_by('id')
    for rostered_player in rostered_player_list:
        entry_score_dict[rostered_player] = get_scaled_player_scoring_dict(rostered_player)
    return entry_score_dict

def get_entry_total_dict(entry_score_dict):
    """
    Get a dictionary of total scores for each week in an entry score dictionary.

    Args:
        entry_score_dict (dict): The entry score dictionary to get total scores for.

    Returns:
        dict: A dictionary where the keys are weeks and the values are the total scores for those weeks.
    """
    final_dict = {'WC': 0.0, 'DIV': 0.0, 'CONF': 0.0, 'SB': 0.0, 'total': 0.0}
    for player, scores in entry_score_dict.items():
        for key in final_dict.keys():
            final_dict[key] += scores[key]
    for entry, total in final_dict.items():
        final_dict[entry] = round(total, 2) 
    return final_dict

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
        cache.delete('all_entry_score_dicts')
        for row in reader:
            player_name = row[0].split('(')[0].strip()
            try:
                player = Player.objects.get(name=player_name)
            except Player.DoesNotExist:
                print(f'Player {player_name} does not exist')
                continue
            # Create or update the weekly stats instance
            create_or_update_weekly_stats_from_row(row, player, stats_attribute)
