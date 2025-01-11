# load_player_stats.py
import logging

from django.core.cache import cache
from django.core.management.base import BaseCommand
from fantasy_football_app.tank_api.api_request import TankAPIClient
from fantasy_football_app.constants import WEEK_CHOICES

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Loads player stats for a given date and week'

    def add_arguments(self, parser):
        parser.add_argument('date', type=str, help='The game date in YYYYMMDD format')
        parser.add_argument('week', type=str, help='The week of the game', choices=[choice[0] for choice in WEEK_CHOICES])

    def handle(self, *args, **options):
        date = options['date']
        week = options['week']
        logger.info(f'Starting to pull API data for date {date} and week {week}')
        client = TankAPIClient()
        updated_players = client.process_player_stats_for_date(date, week)
        cache.delete('ranked_entries_dict')
        cache.delete('players_scoring_dict')
        cache.delete('survivor_entry_standings')
        logger.info(f'Players updated: {updated_players}')
        logger.info(f'Finished pulling API data for date {date} and week {week}')