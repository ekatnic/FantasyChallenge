from computedfields.models import ComputedFieldsModel, compute, computed
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from .constants import WEEK_CHOICES, ROSTER_POSITIONS
from .model_utils import calculate_weekly_score_for_player


class Player(models.Model):
    POSITION_CHOICES = [
        ('QB', 'Quarterback'),
        ('RB', 'Running Back'),
        ('WR', 'Wide Receiver'),
        ('TE', 'Tight End'),
        ('DEF', 'Defense/Special Teams'),
        ('K', 'Kicker')
    ]

    name = models.CharField(max_length=100)
    position = models.CharField(max_length=12, choices=POSITION_CHOICES)
    team = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.name} ({self.position}) - {self.team}'

class PlayerInfo(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='info')
    birthdate = models.DateField(null=True, blank=True)
    height = models.CharField(max_length=20, null=True, blank=True)
    weight = models.CharField(max_length=20, null=True, blank=True)
    school = models.CharField(max_length=100, null=True, blank=True)
    image = models.URLField(null=True, blank=True)

    def __str__(self):
        return f'Info for {self.player}'

class PlayerStats(models.Model):
    SEASON_TYPE_CHOICES = [
    ('regular_season', 'Regular Season'),
    ('pre_season', 'Pre-Season'),
    ('post_season', 'Post-Season'),
    ]

    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='stats')
    season = models.IntegerField()
    # season_type = models.CharField(max_length=50, null=True, blank=True)
    season_type = models.CharField(
        max_length=50,
        choices=SEASON_TYPE_CHOICES,
        null=True,
        blank=True
    )
    rushing_yards_avg = models.FloatField(default=0.0)
    rushing_yards = models.IntegerField(default=0)
    carries = models.IntegerField(default=0)
    long_rush = models.IntegerField(default=0)
    rushing_tds = models.IntegerField(default=0)
    receptions = models.IntegerField(default=0)
    receiving_tds = models.IntegerField(default=0)
    long_rec = models.IntegerField(default=0)
    targets = models.IntegerField(default=0)
    receiving_yards = models.IntegerField(default=0)
    receiving_yards_avg = models.FloatField(default=0.0)
    pass_attempts = models.IntegerField(default=0)
    passing_tds = models.IntegerField(default=0)
    passing_yards = models.IntegerField(default=0)
    interceptions = models.IntegerField(default=0)
    pass_completions = models.IntegerField(default=0)
    passing_yards_avg = models.FloatField(default=0.0)
    qbr = models.FloatField(default=0.0)
    sacked = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)
    fumbles = models.IntegerField(default=0)
    fumbles_lost = models.IntegerField(default=0)
    fumbles_recovered = models.IntegerField(default=0)

    def __str__(self):
        return f'Stats for {self.player} - Season {self.season}'

class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    players = models.ManyToManyField(Player, through='RosteredPlayers')
    name = models.CharField(max_length=200, blank=True)
    wild_card_score = models.FloatField(default=0.0)
    divisional_score = models.FloatField(default=0.0)
    conference_score = models.FloatField(default=0.0)
    super_bowl_score = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0) #a calculated field?
    year = models.CharField(max_length=12, choices=[('2024', '2024'), ('2025', '2025')], default='2024')

    def save(self, *args, **kwargs):
        if not self.name:
            #Get the number of entries already created by this user
            num_entries = Entry.objects.filter(user=self.user).count()
            #Set the name field
            self.name = f"{self.user.first_name} {self.user.last_name} #{num_entries + 1}"
        super().save(*args, **kwargs)


class RosteredPlayers(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    is_captain = models.BooleanField(default=False)
    is_scaled_flex = models.BooleanField(default=False)
    roster_position = models.CharField(
        max_length=20,
        choices=ROSTER_POSITIONS,
        default=''
    )


class WeeklyStats(ComputedFieldsModel):    
    class Meta:
        unique_together = (('player', 'week'),)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=True, blank=True)
    week = models.CharField(max_length=12, choices=WEEK_CHOICES, null=True, blank=True)
    passing_yards = models.IntegerField(default=0)
    passing_tds = models.IntegerField(default=0)
    passing_interceptions = models.IntegerField(default=0)
    rushing_yards = models.IntegerField(default=0)
    rushing_tds = models.IntegerField(default=0)
    receptions = models.IntegerField(default=0)
    receiving_yards = models.IntegerField(default=0)
    receiving_tds = models.IntegerField(default=0)
    fumbles_lost = models.IntegerField(default=0)
    sacks = models.IntegerField(default=0)
    interceptions = models.IntegerField(default=0)
    fumbles_recovered = models.IntegerField(default=0)
    safeties = models.IntegerField(default=0)
    defensive_tds = models.IntegerField(default=0)
    return_tds = models.IntegerField(default=0)
    points_allowed = models.IntegerField(default=0)
    two_pt_conversions = models.IntegerField(default=0)
    @computed(models.FloatField(), depends=[
       ('self', ['passing_yards', 'passing_tds', 'passing_interceptions', 
        'rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 
        'receiving_tds', 'fumbles_lost', 'sacks', 'interceptions', 
        'fumbles_recovered', 'safeties', 'defensive_tds', 'return_tds', 
        'points_allowed', 'two_pt_conversions']),
        ( 'player', ['position']),
        ]
    )
    def week_score(self):
        return calculate_weekly_score_for_player(self)