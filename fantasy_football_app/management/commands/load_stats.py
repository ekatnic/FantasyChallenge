import csv
import django
import os

from django.core.cache import cache
from django.core.management.base import BaseCommand

from fantasy_football_app.models import CSVUpload, Player, WeeklyStats
from fantasy_football_app.utils import update_player_stats_from_csv

class Command(BaseCommand):
    help = 'Update player stats from an uploaded CSV file'
    
    def add_arguments(self, parser):
        parser.add_argument('csv_id', type=int, help='The ID of the CSVUpload object')

    def handle(self, *args, **options):
        csv_upload = CSVUpload.objects.get(pk=options['csv_id'])
        update_player_stats_from_csv(csv_upload.file.path, csv_upload.week)
