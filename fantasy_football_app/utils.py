from .constants import position_order
from .scoring import get_scaled_player_scoring_dict
'''
Creates and returns a dict of players mapping player instance to total score
param: entry - entry instance
return: player_total_dict - dict mapping player instance to total score
'''
def get_entry_score_dict(entry):
    entry_score_dict = {}
    rostered_player_list = entry.rosteredplayers_set.all().order_by('id')
    for rostered_player in rostered_player_list:
        entry_score_dict[rostered_player] = get_scaled_player_scoring_dict(rostered_player)
    return entry_score_dict

def get_entry_total_dict(entry_score_dict):
    final_dict = {'WC': 0.0, 'DIV': 0.0, 'CONF': 0.0, 'SB': 0.0, 'total': 0.0}
    for player, scores in entry_score_dict.items():
        for key in final_dict.keys():
            final_dict[key] += scores[key]
    return final_dict