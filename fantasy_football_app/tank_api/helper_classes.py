import logging

from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404

from ..constants import TEAM_ABBREV_TO_TEAM_NAME
from ..models import Player
from ..data_utils import create_or_update_weekly_stats_from_stats

STAT_TYPES = ["Rushing", "Receiving", "Passing"]

class DataProcessor:

    @staticmethod
    def process_player_stats_dict(player_stats_dict, week):
        player_set = set()
        for player_id, player_stats in player_stats_dict.items():
            if not any(player_stats.get(stat_type) for stat_type in STAT_TYPES):
                logging.warning(f'Player {player_stats["longName"]} does not have offensive stats')
                continue
            try:
                player = Player.objects.get(name=player_stats["longName"])
            except ObjectDoesNotExist:
                logging.error(f'Player {player_stats["longName"]} does not exist')
                continue
            create_or_update_weekly_stats_from_stats(player_stats, player, week)
            player_set.add(player_stats["longName"])
        return player_set

    @staticmethod
    def process_defense_stats_dict(defense_stats_dict, week):
        defense_set = set()
        for defense_abbrev, defensive_stats in defense_stats_dict.items():
            try:
                player = get_object_or_404(Player, name=TEAM_ABBREV_TO_TEAM_NAME[defense_abbrev])
            except:
                print(f'Player {defense_abbrev} does not exist')
                continue
            # Create or update the weekly stats instance
            create_or_update_weekly_stats_from_stats(defensive_stats, player, week)
            defense_set.add(TEAM_ABBREV_TO_TEAM_NAME[defense_abbrev])
        return defense_set