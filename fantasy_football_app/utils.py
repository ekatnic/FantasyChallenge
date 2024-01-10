'''
Creates and returns a dict of players mapping player instance to total score
param: entry - entry instance
return: player_total_dict - dict mapping player instance to total score
'''
def create_player_totals_dict_list(entry):
    player_total_dict = {}
    player_list = entry.players.prefetch_related('playerstats_set').all()
    for player in player_list:
        player_total_dict[player] = player.playerstats_set.first()
    return player_total_dict