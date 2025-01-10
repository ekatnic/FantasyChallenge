def calculate_weekly_score_for_player(weekly_stats):
    base_score = 0.0
    position = weekly_stats.player.position
    if position == 'DEF':
        base_score += weekly_stats.sacks * 1
        base_score += weekly_stats.fumbles_recovered * 2
        base_score += weekly_stats.interceptions * 2
        base_score += weekly_stats.safeties * 5
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
    elif position == 'K':
        base_score += weekly_stats.fg_made * 3
        base_score -= weekly_stats.fg_missed
        base_score += weekly_stats.xp_made
        base_score -= weekly_stats.xp_missed
    elif position == 'TE':
        base_score += weekly_stats.passing_yards * 0.05
        base_score += weekly_stats.passing_tds * 4.0
        base_score += weekly_stats.passing_interceptions * -1.0
        base_score += weekly_stats.rushing_yards * 0.1
        base_score += weekly_stats.rushing_tds * 6.0
        base_score += weekly_stats.receptions * 1.5
        base_score += weekly_stats.receiving_yards * 0.1
        base_score += weekly_stats.receiving_tds * 6.0
        base_score += weekly_stats.fumbles_lost * -1.0
        base_score += weekly_stats.sacks * 0
        base_score += weekly_stats.interceptions * 0
        base_score += weekly_stats.safeties * 0
        base_score += weekly_stats.defensive_tds * 0
        base_score += weekly_stats.return_tds * 0
        base_score += weekly_stats.points_allowed * 0
        base_score += weekly_stats.two_pt_conversions * 2
    else:
        base_score += weekly_stats.passing_yards * 0.05
        base_score += weekly_stats.passing_tds * 4.0
        base_score += weekly_stats.passing_interceptions * -1.0
        base_score += weekly_stats.rushing_yards * 0.1
        base_score += weekly_stats.rushing_tds * 6.0
        base_score += weekly_stats.receptions * 1.0
        base_score += weekly_stats.receiving_yards * 0.1
        base_score += weekly_stats.receiving_tds * 6.0
        base_score += weekly_stats.fumbles_lost * -1.0
        base_score += weekly_stats.sacks * 0
        base_score += weekly_stats.interceptions * 0
        base_score += weekly_stats.safeties * 0
        base_score += weekly_stats.defensive_tds * 0
        base_score += weekly_stats.return_tds * 0
        base_score += weekly_stats.points_allowed * 0
        base_score += weekly_stats.two_pt_conversions * 2
    return round(base_score, 2)
