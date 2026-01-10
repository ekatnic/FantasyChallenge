import logging

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from django.shortcuts import get_object_or_404

from ..constants import TEAM_ABBREV_TO_TEAM_NAME
from ..models import Player
from ..data_utils import create_or_update_weekly_stats_from_stats

STAT_TYPES = ["Rushing", "Receiving", "Passing", "Kicking"]

class DataProcessor:

    @staticmethod
    def process_player_stats_dict(player_stats_dict, week, season='2026'):
        player_set = set()
        for _, player_stats in player_stats_dict.items():
            if not any(player_stats.get(stat_type) for stat_type in STAT_TYPES):
                logging.warning(f'Player {player_stats["longName"]} does not have offensive stats')
                continue
            player_name = player_stats["longName"]


            # We have a data model issue -- "Player" should be unique, but we have 1 for each team
            # Weekly stats should be associated with PlayerStats, not Player
            # PlayerStats should really be something like PlayerSeason
            # We should deprecate Player.team and rely on PlayerSeason for a given season
            # to inform which players to choose. This is a workaround.
            try:
                player = Player.objects.get(name=player_name)

            except MultipleObjectsReturned:
                print(f"Multiple players found with name '{player_name}'")
                # More than one player with same name
                players = Player.objects.filter(name=player_name)

                # Find the one with stats for this season
                players_with_stats = players.filter(
                    stats__season='2025'
                ).distinct()

                if players_with_stats.count() == 1:
                    player = players_with_stats.first()
                    print(f"Selected player '{player.name}' with ID {player.id} and team '{player.team}'")
                elif players_with_stats.count() > 1:
                    logging.error(
                        f"Multiple players named '{player_name}' found with stats for season {season}"
                    )
                    continue
                else:
                    logging.error(
                        f"No PlayerStats found for '{player_name}' in season {season}"
                    )
                    continue

            except ObjectDoesNotExist:
                logging.error(f"Player '{player_name}' does not exist")
                continue
            create_or_update_weekly_stats_from_stats(player_stats, player, week, season)
            player_set.add(player_stats["longName"])
        return player_set

    @staticmethod
    def process_defense_stats_dict(defense_stats_dict, week, season='2026'):
        defense_set = set()
        for defense_abbrev, defensive_stats in defense_stats_dict.items():
            try:
                player = get_object_or_404(Player, name=TEAM_ABBREV_TO_TEAM_NAME[defense_abbrev])
            except:
                print(f'Player {defense_abbrev} does not exist')
                continue
            # Create or update the weekly stats instance
            create_or_update_weekly_stats_from_stats(defensive_stats, player, week, season)
            defense_set.add(TEAM_ABBREV_TO_TEAM_NAME[defense_abbrev])
        return defense_set