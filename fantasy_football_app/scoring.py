# scoring.py
from .models import PlayerStats, Entry, Standings, WeeklyStats, Player
from django.db.models import F


def calculate_weekly_score_for_player(player_stats, weekly_stats_attr):
    weekly_stats = getattr(player_stats, weekly_stats_attr)
    base_score = 0.0
    if player_stats.position == 'D/ST':
        base_score += weekly_stats.sacks * 1
        base_score += weekly_stats.interceptions * 2
        base_score += weekly_stats.blocks * 2
        base_score += weekly_stats.safeties * 2
        base_score += weekly_stats.defensive_tds * 6
        base_score += weekly_stats.return_tds * 6
        if weekly_stats.points_allowed == 0:
            base_score += 12
        elif weekly_stats.points_allowed <= 6:
            base_score += 8
        elif weekly_stats.points_allowed <= 10:
            base_score += 5
        else:
            base_score += 0
    elif player_stats.position == 'TE':
        base_score += weekly_stats.passing_yards * 0.05
        base_score += weekly_stats.passing_tds * 6.0
        base_score += weekly_stats.passing_interceptions * -1.0
        base_score += weekly_stats.rushing_yards * 0.1
        base_score += weekly_stats.rushing_tds * 6.0
        base_score += weekly_stats.receptions * 1.5
        base_score += weekly_stats.receiving_yards * 0.1
        base_score += weekly_stats.receiving_tds * 6.0
        base_score += weekly_stats.fumbles_lost * -1.0
        base_score += weekly_stats.sacks * 0
        base_score += weekly_stats.interceptions * 0
        base_score += weekly_stats.blocks * 0
        base_score += weekly_stats.safeties * 0
        base_score += weekly_stats.defensive_tds * 0
        base_score += weekly_stats.return_tds * 0
        base_score += weekly_stats.points_allowed * 0
    else:
        base_score += weekly_stats.passing_yards * 0.05
        base_score += weekly_stats.passing_tds * 6.0
        base_score += weekly_stats.passing_interceptions * -1.0
        base_score += weekly_stats.rushing_yards * 0.1
        base_score += weekly_stats.rushing_tds * 6.0
        base_score += weekly_stats.receptions * 1.0
        base_score += weekly_stats.receiving_yards * 0.1
        base_score += weekly_stats.receiving_tds * 6.0
        base_score += weekly_stats.fumbles_lost * -1.0
        base_score += weekly_stats.sacks * 0
        base_score += weekly_stats.interceptions * 0
        base_score += weekly_stats.blocks * 0
        base_score += weekly_stats.safeties * 0
        base_score += weekly_stats.defensive_tds * 0
        base_score += weekly_stats.return_tds * 0
        base_score += weekly_stats.points_allowed * 0
    weekly_stats.week_score = base_score
    weekly_stats.save()

def calculate_weekly_score_for_entry(entry, week):
    weekly_score = 0.0
    for player in entry.players.all():
        player_stats = PlayerStats.objects.get(player__name=player.name)
        weekly_stats = getattr(player_stats, f'{week}_stats')
        if weekly_stats is not None:
            weekly_score += weekly_stats.week_score
    setattr(entry, f'{week}_score', weekly_score)
    entry.save()


def calculate_total_score_for_player(player_stats):
    total_score = 0.0
    total_score += player_stats.wild_card_stats.week_score
    total_score += player_stats.divisional_stats.week_score
    total_score += player_stats.conference_stats.week_score
    total_score += player_stats.super_bowl_stats.week_score
    player_stats.total = total_score
    player_stats.save()
    return total_score

def calculate_total_score_for_entry(entry):
    entry.total = entry.wild_card_score + entry.divisional_score + entry.conference_score + entry.super_bowl_score
    entry.save()


def calculate_weekly_score_for_entry(entry, week):
    weekly_score = 0.0
    for player in entry.players.all():
        player_stats = PlayerStats.objects.get(player__name=player.name)
        weekly_stats = getattr(player_stats, f'{week}_stats')
        if weekly_stats is not None:
            weekly_score += weekly_stats.week_score
    setattr(entry, f'{week}_score', weekly_score)
    entry.save()

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