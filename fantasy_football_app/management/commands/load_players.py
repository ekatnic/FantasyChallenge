# management/commands/load_players.py
from django.core.management.base import BaseCommand
from fantasy_football_app.models import Player
from django.core.cache import cache
import csv

class Command(BaseCommand):
    help = 'Load players from CSV file'

    def handle(self, *args, **options):
        Player.objects.all().delete()
        cache.delete('ranked_entries_dict')
        cache.delete('players_scoring_dict')
        with open('data/All_Players_Test.csv', 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                Player.objects.create(name=row[0], position=row[1], team=row[2])