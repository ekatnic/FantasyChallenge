from django.core.cache import cache
from django.db.models import (Case, Count, F, FloatField, Func, IntegerField,
                              Prefetch, Sum, When)
from django.db.models.functions import Round

from .constants import FLEX_POSITIONS, INPUT_INDEXES
from .models import Entry, Player, WeeklyStats
from .scoring import (get_raw_player_scoring_dict,
                      get_roster_percentage_multiplier,
                      get_scaled_player_scoring_dict)


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
        entries = Entry.objects.filter(year="2025").prefetch_related('rosteredplayers_set__player__weeklystats_set').order_by('id')
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

def get_summarized_players():
    """
    Get a dictionary of player data with rostership counts and percentages
    returns: dictionary of summarized player data {player : scoring/rostership dict}
    """
    players_scoring_dict = {}
    total_entries = float(Entry.objects.count())
    player_counts = Player.objects.annotate(
        roster_count=Count('rosteredplayers'),
        roster_percentage=Round(F('roster_count') / total_entries * 100, 2),
        captain_count=Sum(
            Case(
                When(rosteredplayers__is_captain=True, then=1),
                default=0,
                output_field=IntegerField()
            )
        ),
        captain_percentage=Round(F('captain_count') / total_entries * 100, 2),
        scaled_flex_count=Sum(
            Case(
                When(rosteredplayers__is_scaled_flex=True, then=1),
                default=0,
                output_field=IntegerField()
            )
        ),
        scaled_flex_percentage=Round(F('scaled_flex_count') / total_entries * 100, 2),
    )

    # Filter the QuerySet to include only Players with one or more RosteredPlayer
    player_counts = player_counts.order_by('-roster_percentage')
    for player in player_counts:
        player_dict = get_raw_player_scoring_dict(player)
        player_dict['scaled_flex_multiplier'] = (
            str(get_roster_percentage_multiplier(player.roster_percentage)) + 'x'
            if player.position in FLEX_POSITIONS
            else ''
        )
        players_scoring_dict[player] = player_dict
    return players_scoring_dict

def update_and_return(dict_obj, update_dict):
    dict_obj.update(update_dict)
    return dict_obj
