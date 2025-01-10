from django.core.cache import cache

from .models import Player, WeeklyStats

def create_or_update_weekly_stats_from_stats(stats, player, week):
    """
    This function creates or updates a WeeklyStats object for a given player and week.

    Parameters:
    row (list): A list representing a row of data from the pull api job.
    player (Player): A Player object representing the player for whom the stats are being updated.
    stats_attribute (str): A string representing the week for which the stats are being updated.

    Returns:
    None
    """
    try:
        weekly_stats = WeeklyStats.objects.get(player=player, week=week)
    except WeeklyStats.DoesNotExist:
        weekly_stats = WeeklyStats(player=player, week=week)
    if player.position == 'DEF':
        process_defense_weekly_stat(weekly_stats, stats)
    else:
        process_offensive_weekly_stat(weekly_stats, stats)


def process_defense_weekly_stat(weekly_stats, stats):
    """
    This function processes a defensive WeeklyStats object for a given defense and week.

    Parameters:
    weekly_stats (WeeklyStats): A WeeklyStats object representing the defense for whom the stats are being updated.
    stats (dict): A dictionary representing the stats for a given week.

    Returns:
    None
    """
    weekly_stats.points_allowed = int(stats.get('ptsAllowed', 0))
    weekly_stats.fumbles_recovered = int(stats.get('fumblesRecovered', 0))
    weekly_stats.interceptions = int(stats.get('defensiveInterceptions', 0))
    weekly_stats.safeties = int(stats.get('safeties', 0))
    weekly_stats.sacks = int(stats.get('sacks', 0))
    weekly_stats.defensive_tds = int(stats.get('defTD', 0))
    # Convert the weekly stats for that week to fantasy points
    weekly_stats.save()

def process_offensive_weekly_stat(weekly_stats, stats):
    """
    This function processes an offensive WeeklyStats object for a given player and week.

    Parameters:
    weekly_stats (WeeklyStats): A WeeklyStats object representing the player for whom the stats are being updated.
    stats (dict): A dictionary representing the stats for a given week.

    Returns:
    None
    """
    passing_stats = stats.get('Passing', {})
    receiving_stats = stats.get('Receiving', {})
    rushing_stats = stats.get('Rushing', {})
    kicking_stats = stats.get('Kicking', {})
    fumble_stats = stats.get('Defense', {})
    weekly_stats.passing_yards = int(passing_stats.get('passYds', 0))
    weekly_stats.passing_tds = int(passing_stats.get('passTD', 0))
    weekly_stats.passing_interceptions = int(passing_stats.get('int', 0))
    weekly_stats.rushing_yards = int(rushing_stats.get('rushYds', 0))
    weekly_stats.rushing_tds = int(rushing_stats.get('rushTD', 0))
    weekly_stats.receptions = int(receiving_stats.get('receptions', 0))
    weekly_stats.receiving_yards = int(receiving_stats.get('recYds', 0))
    weekly_stats.receiving_tds = int(receiving_stats.get('recTD', 0))
    weekly_stats.two_pt_conversions = (
        int(rushing_stats.get('rushingTwoPointConversion', 0)) + 
        int(receiving_stats.get('receivingTwoPointConversion', 0)) + 
        int(passing_stats.get('passingTwoPointConversion', 0))
    )
    weekly_stats.fumbles_lost = int(fumble_stats.get('fumblesLost', 0))
    weekly_stats.fg_made = int(kicking_stats.get('fgMade', 0))
    weekly_stats.fg_missed = int(kicking_stats.get('fgMissed', 0))
    weekly_stats.xp_made = int(kicking_stats.get('xpMade', 0))
    weekly_stats.xp_missed = int(kicking_stats.get('xpMissed', 0))

    # Convert the weekly stats for that week to fantasy points
    weekly_stats.save()
