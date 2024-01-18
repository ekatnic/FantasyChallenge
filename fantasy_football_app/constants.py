FLEX_POSITIONS = ['RB', 'WR', 'TE']
POSITION_ORDER = ['QB', 'RB 1', 'RB 2', 'WR 1', 'WR 2', 'TE', 'FLEX 1', 'FLEX 2', 'FLEX 3', 'FLEX 4', 'SCALED FLEX', 'DEF']
INPUT_INDEXES = {
    'passing_yards': 7,
    'passing_tds': 8,
    'passing_interceptions': 9,
    'rushing_yards': 11,
    'rushing_tds': 13,
    'receptions': 14,
    'receiving_yards': 16,
    'receiving_tds': 18,
    'two_pt_conversions': 19,
    'fumbles_lost': 20,
    'points_allowed': 21,
    'fumbles_recovered': 22,
    'interceptions': 23,
    'safeties': 24,
    'sacks': 25,
    'defensive_tds': 26,
    'return_tds': 27,
}
WEEK_CHOICES = [
        ('WC', 'Wild Card'),
        ('DIV', 'Divisional'),
        ('CONF', 'Conference'),
        ('SB', 'Super Bowl'),
    ]

DEFENSE_STATS_NAMES = {
    'week': 'WEEK',
    'points_allowed': 'POINTS ALLOWED',
    'fumbles_recovered': 'FUM REC',
    'interceptions': 'INTS',
    'safeties': 'SAFETIES',
    'sacks': 'SACKS',
    'defensive_tds': 'DEF TDS',
    'return_tds': 'ST TDS',
    'week_score': 'FANTASY PTS',
}

SKILL_POS_STATS_NAMES = {
    'week': 'WEEK',
    'passing_yards': 'PASS YARDS',
    'passing_tds': 'PASS TDS',
    'passing_interceptions': 'INT',
    'rushing_yards': 'RUSH YADS',
    'rushing_tds': 'RUSH TDS',
    'receptions': 'REC',
    'receiving_yards': 'REC YDS',
    'receiving_tds': 'REC TDS',
    'two_pt_conversions': '2PC',
    'fumbles_lost': 'FUM LOST',
    'week_score': 'FANTASY PTS',
}