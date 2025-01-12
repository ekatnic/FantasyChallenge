from django.core.cache import cache
from django.db.models import (Case, Count, F, FloatField, Func, IntegerField,
                              Prefetch, Sum, When)
from django.db.models.functions import Round

from .constants import FLEX_POSITIONS, INPUT_INDEXES
from .models import Entry, Player, WeeklyStats, RosteredPlayers
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
    Get a list of total scores for each entry in the database.
    Returns:
        list: A list of dictionaries with the required fields.
    """
    # Try to get the result from the cache
    ranked_entries_dict = cache.get('ranked_entries_dict')
    # If the result was not in the cache, calculate it and store it in the cache
    if ranked_entries_dict is None:
        entries = Entry.objects.filter(year="2025").prefetch_related('rosteredplayers_set__player__weeklystats_set').order_by('id')
        all_entry_score_dict = get_entry_list_score_dict(entries)
        ranked_entries_dict = rank_entries(all_entry_score_dict)
        cache.set('ranked_entries_dict', ranked_entries_dict, 60 * 30)  # Cache results for 30 minutes

    # Convert the dictionary to a list of dictionaries with the required fields
    result = [
        {
            'id': entry.id,
            'name': entry.name,
            'user_id': entry.user_id,
            'WC': scores['WC'],
            'DIV': scores['DIV'],
            'CONF': scores['CONF'],
            'SB': scores['SB'],
            'total': scores['total'],
            'rank': scores['rank']
        }
        for entry, scores in ranked_entries_dict.items()
    ]
    return result

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
    Get a list of player data with rostership counts and percentages
    returns: list of summarized player data dictionaries
    """
    total_entries = float(Entry.objects.count())
    if not total_entries:
        return []
    player_counts = Player.objects.annotate(
        roster_count=Count('rosteredplayers'),
        roster_percentage=Round(F('roster_count') / total_entries * 100, 2),
        scaled_flex_count=Sum(
            Case(
                When(rosteredplayers__roster_position="Scaled Flex1", then=1),
                When(rosteredplayers__roster_position="Scaled Flex2", then=1),
                default=0,
                output_field=IntegerField()
            )
        ),
        scaled_flex_percentage=Round(F('scaled_flex_count') / total_entries * 100, 2),
    )

    # Filter the QuerySet to include only Players with one or more RosteredPlayer
    player_counts = player_counts.order_by('-roster_percentage')
    summarized_players = []
    for player in player_counts:
        if not player.roster_count:
            continue
        player_dict = get_raw_player_scoring_dict(player)
        summarized_player = {
            'id': player.id,
            'name': player.name,
            'team': player.team,
            'position': player.position,
            'roster_percentage': player.roster_percentage,
            'scaled_flex_percentage': player.scaled_flex_percentage,
            'WC': player_dict.get('WC', 0.0),
            'DIV': player_dict.get('DIV', 0.0),
            'CONF': player_dict.get('CONF', 0.0),
            'SB': player_dict.get('SB', 0.0),
            'total': player_dict.get('total', 0.0),
            'scaled_flex_multiplier': (
                str(get_roster_percentage_multiplier(player.roster_percentage)) + 'x'
                if player.position in FLEX_POSITIONS
                else ''
            )
        }
        summarized_players.append(summarized_player)

    return summarized_players

def update_and_return(dict_obj, update_dict):
    dict_obj.update(update_dict)
    return dict_obj
