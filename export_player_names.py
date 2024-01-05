import os
import django
import csv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fantasy_football_project.settings')
django.setup()

from fantasy_football_app.models import PlayerStats

def export_player_names(csv_file_paths):
    player_names = [player_stats.name for player_stats in PlayerStats.objects.all()]
    print(player_names)  # Print the player names after they're fetched from the database

    for csv_file_path in csv_file_paths:
        # Read the existing data
        with open(csv_file_path, 'r', newline='') as csv_file:
            reader = csv.reader(csv_file)
            data = list(reader)

        # Update the first column with the player names
        for i, name in enumerate(player_names, start=1):
            if i < len(data):
                data[i][0] = name
            else:
                data.append([name] + [''] * (len(data[0]) - 1))

        # Write the data back to the file
        with open(csv_file_path, 'w', newline='') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerows(data)
            print(f'Wrote player names to {csv_file_path}')  # Print a message after each file is written

# Export the player names
csv_files = ['data/wild_card.csv', 'data/divisional.csv', 'data/conference.csv', 'data/super_bowl.csv']
export_player_names(csv_files)