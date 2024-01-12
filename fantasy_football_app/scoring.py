# scoring.py
from .models import Entry, Standings, WeeklyStats, Player
from django.db.models import F


def get_scaled_player_scoring_dict(rostered_player):
    scoring_dict = get_raw_player_scoring_dict(rostered_player.player)
    for week, score in scoring_dict.items():
        if rostered_player.is_captain:
            scoring_dict[week] = round(score * 1.5, 2)
        # elif rostered_player.is_scaled_flex:
        #     scoring_dict[week] = score * get_scaled_flex_multiplier(rostered_player.player)
    return scoring_dict

def get_raw_player_scoring_dict(player):
    total = 0.0
    scoring_dict = {
        "WC": 0.0,
        "DIV": 0.0,
        "CONF": 0.0,
        "SB": 0.0,
        "total": 0.0,
    }
    weekly_scores = player.weeklystats_set.all()
    for week_score in weekly_scores:
        total += week_score.week_score
        scoring_dict[week_score.week] = week_score.week_score
    scoring_dict['total'] = total
    return scoring_dict


def calculate_standings():
    # Delete existing standings
    Standings.objects.all().delete()

    # Get all entries and sort them by total score in descending order
    entries = Entry.objects.all().order_by('-total')

    # Create a Standings object for each entry
    for i, entry in enumerate(entries, start=1):
        Standings.objects.create(
            entry_name=entry.name,
            entry_score=entry.total,
            standings_place=i,
        )