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

WEEK_START_DATES = {
    'WC': '20260110',
    'DIV': '20260117',
    'CONF': '20260125',
    'SB': '20260208',
}

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

TEAM_ABBREV_TO_TEAM_NAME = {
    'ARI': 'Arizona Cardinals',
    'ATL': 'Atlanta Falcons',
    'BAL': 'Baltimore Ravens',
    'BUF': 'Buffalo Bills',
    'CAR': 'Carolina Panthers',
    'CHI': 'Chicago Bears',
    'CIN': 'Cincinnati Bengals',
    'CLE': 'Cleveland Browns',
    'DAL': 'Dallas Cowboys',
    'DEN': 'Denver Broncos',
    'DET': 'Detroit Lions',
    'GB': 'Green Bay Packers',
    'HOU': 'Houston Texans',
    'IND': 'Indianapolis Colts',
    'JAX': 'Jacksonville Jaguars',
    'KC': 'Kansas City Chiefs',
    'LV': 'Las Vegas Raiders',
    'LAC': 'Los Angeles Chargers',
    'LAR': 'Los Angeles Rams',
    'MIA': 'Miami Dolphins',
    'MIN': 'Minnesota Vikings',
    'NE': 'New England Patriots',
    'NO': 'New Orleans Saints',
    'NYG': 'New York Giants',
    'NYJ': 'New York Jets',
    'PHI': 'Philadelphia Eagles',
    'PIT': 'Pittsburgh Steelers',
    'SF': 'San Francisco 49ers',
    'SEA': 'Seattle Seahawks',
    'TB': 'Tampa Bay Buccaneers',
    'TEN': 'Tennessee Titans',
    'WSH': 'Washington Commanders',
}

ROSTER_POSITIONS = [
    ('QB', 'QB'),
    ('RB1', 'RB1'),
    ('RB2', 'RB2'),
    ('WR1', 'WR1'),
    ('WR2', 'WR2'),
    ('TE', 'TE'),
    ('Flex1', 'Flex1'),
    ('Flex2', 'Flex2'),
    ('Scaled Flex1', 'Scaled Flex1'),
    ('Scaled Flex2', 'Scaled Flex2'),
    ('DEF', 'DEF'),
    ('K', 'K')
]