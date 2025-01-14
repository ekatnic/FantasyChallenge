# load_player_stats.py
import logging
import os
import datetime
import pytz

from django.core.cache import cache
from django.core.management.base import BaseCommand
from fantasy_football_app.tank_api.api_request import TankAPIClient
from fantasy_football_app.constants import WEEK_START_DATES
from fantasy_football_app.utils import (
    get_all_entry_score_dicts, 
    get_summarized_players, 
    get_survivor_standings
)

logger = logging.getLogger(__name__)

def get_current_week(current_date):
    if current_date < WEEK_START_DATES["DIV"]:
        return 'WC'
    if current_date < WEEK_START_DATES["CONF"]:
        return 'DIV'
    if current_date < WEEK_START_DATES["SB"]:
        return 'CONF'
    return 'SB'

class Command(BaseCommand):
    help = 'Loads player stats for current week'

    def add_arguments(self, parser):
        parser.add_argument(
            'date', 
            type=str,
            nargs='?', # optional
            help='The game date in YYYYMMDD format. Defaults to current.'
        )

    def handle(self, *args, **options):
        job_enabled = os.getenv('LIVE_GAME_LOAD_ENABLED', 'false').lower() == 'true'
        if not job_enabled:
            print("Job is disabled in Heroku vars. Set LIVE_GAME_LOAD_ENABLED to 'true' to pull data. Exiting.")
            return
        date = options['date'] if options['date'] else datetime.datetime.now(pytz.timezone('America/Los_Angeles')).strftime('%Y%m%d')
        week = get_current_week(date)
        logger.info(f'Starting to pull API data for date {date} and week {week}')
        client = TankAPIClient()
        updated_players = client.process_player_stats_for_date(date, week)
        logger.info(f'Players updated: {updated_players}')

        # warm the cache
        logger.info('Warming the cache - ranked_entries_dict')
        cache.delete('ranked_entries_dict')
        get_all_entry_score_dicts()

        logger.info('Warming the cache - players_scoring_dict')
        cache.delete('players_scoring_dict')
        get_summarized_players()

        logger.info('Warming the cache - survivor_entry_standings')
        cache.delete('survivor_entry_standings')
        get_survivor_standings()

        logger.info(f'Finished pulling API data for date {date} and week {week}')