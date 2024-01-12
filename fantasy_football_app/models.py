from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .model_utils import calculate_weekly_score_for_player
from computedfields.models import ComputedFieldsModel, computed, compute

class Player(models.Model):
    POSITION_CHOICES = [
        ('QB', 'Quarterback'),
        ('RB', 'Running Back'),
        ('WR', 'Wide Receiver'),
        ('TE', 'Tight End'),
        ('DEF', 'Defense/Special Teams'),
    ]

    name = models.CharField(max_length=100)
    position = models.CharField(max_length=12, choices=POSITION_CHOICES)
    team = models.CharField(max_length=50)
    #rostered_percentage = models.FloatField(default=0.0) 

    def __str__(self):
        return f'{self.name} ({self.position}) - {self.team}'


class Entry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    players = models.ManyToManyField(Player, through='RosteredPlayers')
    name = models.CharField(max_length=200, blank=True)
    wild_card_score = models.FloatField(default=0.0)
    divisional_score = models.FloatField(default=0.0)
    conference_score = models.FloatField(default=0.0)
    super_bowl_score = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0) #a calculated field?

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

from django.db import models

class WeeklyStats(ComputedFieldsModel):    
    POSITION_CHOICES = [
        ('WC', 'Wild Card'),
        ('DIV', 'Divisional'),
        ('CONF', 'Conference'),
        ('SB', 'Super Bowl'),
    ]
    class Meta:
        unique_together = (('player', 'week'),)
    player = models.ForeignKey(Player, on_delete=models.CASCADE, null=True, blank=True)
    week = models.CharField(max_length=12, choices=POSITION_CHOICES, null=True, blank=True)
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
