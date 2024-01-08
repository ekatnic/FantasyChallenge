# management/commands/load_players.py
from django.core.management.base import BaseCommand
from fantasy_football_app.models import Player
import csv

class Command(BaseCommand):
    help = 'Load players from CSV file'

    def handle(self, *args, **options):
        Player.objects.all().delete()
        with open('data/All_Players_Test.csv', 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                Player.objects.update_or_create(name=row[0], team=row[2], defaults={'position': row[1]})