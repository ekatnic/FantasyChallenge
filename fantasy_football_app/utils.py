from .constants import position_order
from .scoring import get_scaled_player_scoring_dict


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
    return final_dict