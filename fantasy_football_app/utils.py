from .constants import position_order
from .scoring import get_player_scoring_dict
'''
Creates and returns a dict of players mapping player instance to total score
param: entry - entry instance
return: player_total_dict - dict mapping player instance to total score
'''
def create_player_totals_dict_list(entry):
    player_total_dict = {}
    rostered_player_list = entry.rosteredplayers_set.prefetch_related('player__weeklystats_set').all().order_by('id')
    for order, rostered_player in enumerate(rostered_player_list):
        scoring_dict = get_player_scoring_dict(rostered_player.player)
        player_total_dict[rostered_player.player] = {
            "scoring_dict": scoring_dict,
            "position": position_order[order],
        }
    return player_total_dict