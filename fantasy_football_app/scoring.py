# scoring.py
from django.db.models import F

from .models import Entry, Player, RosteredPlayers, WeeklyStats


def get_roster_percentage_multiplier(rostered_percentage):
    """
    Calculate and return the roster percentage multiplier based on the percentage of entries they are rostered in.
    """
    if rostered_percentage >= 50:
        return 1.0
    elif 25 <= rostered_percentage < 50:
        return 1.2
    elif 12.5 <= rostered_percentage < 25:
        return 1.3
    elif 5 <= rostered_percentage < 12.5:
        return 1.5
    else:
        return 1.75

def get_player_scaled_flex_multiplier(player):
    """
    Calculate and return the scaled flex multiplier for a player based on the percentage of entries they are rostered in.

    Args:
        player (Player): The player to calculate the multiplier for.

    Returns:
        float: The scaled flex multiplier.
    """
    total_entries = Entry.objects.all().count()
    rostered_count = RosteredPlayers.objects.filter(player=player).count()
    rostered_percentage = (rostered_count / total_entries) * 100
    return get_roster_percentage_multiplier(rostered_percentage)


def get_scaled_player_scoring_dict(rostered_player):
    """
    Get the scoring dictionary for a player, applying multipliers for captain and scaled flex positions.

    Args:
        rostered_player (RosteredPlayers): The rostered player to get the scoring dictionary for.

    Returns:
        dict: The scoring dictionary.
    """
    scoring_dict = get_raw_player_scoring_dict(rostered_player.player)
    for week, score in scoring_dict.items():
        if rostered_player.is_captain:
            scoring_dict[week] = round(score * 1.5, 2)
        elif rostered_player.is_scaled_flex:
            scoring_dict[week] = round(score * get_player_scaled_flex_multiplier(rostered_player.player), 2)
    return scoring_dict

def get_raw_player_scoring_dict(player):
    """
    Get the raw scoring dictionary for a player without applying any multipliers.

    Args:
        player (Player): The player to get the scoring dictionary for.

    Returns:
        dict: The raw scoring dictionary.
    """
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
