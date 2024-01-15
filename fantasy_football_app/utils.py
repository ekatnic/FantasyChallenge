import csv

from django.db.models import Prefetch
from django.core.cache import cache
from .constants import INPUT_INDEXES
from .scoring import get_scaled_player_scoring_dict
from .models import Entry, Player, WeeklyStats

def rank_entries(entries_dict):
    """
    Rank entries in a dictionary of entries and their total scores.

    Args:
        entries_dict (dict): A dictionary where the keys are entries and the values are dicts of their total scores.
    """
    sorted_entries = sorted(entries_dict.items(), key=lambda x: x[1]['total'], reverse=True)

    user_entries = {}
    last_score = None
    for i, (entry, scoring_dict) in enumerate(sorted_entries, start=1):
        if scoring_dict['total'] != last_score:
            rank = i
        user_entries[entry] = {**scoring_dict, 'rank': rank}
        last_score = scoring_dict['total']
    return user_entries

def get_all_entry_score_dicts():
    """
    Get a dictionary of total scores for each entry in db
    Returns:
        dict: A dictionary where the keys are entries and the values are dicts of their total scores.
    """
    # Try to get the result from the cache
    ranked_entries_dict = cache.get('ranked_entries_dict')

    # If the result was not in the cache, calculate it and store it in the cache
    if ranked_entries_dict is None:
        entries = Entry.objects.prefetch_related('rosteredplayers_set__player__weeklystats_set').all().order_by('id')
        all_entry_score_dict = get_entry_list_score_dict(entries)
        ranked_entries_dict = rank_entries(all_entry_score_dict)
        cache.set('ranked_entries_dict', ranked_entries_dict, 60 * 30)  # Cache results for 30 minutes
    return ranked_entries_dict

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
