from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


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
    total = models.FloatField(default=0.0)

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

from django.db import models

class WeeklyStats(models.Model):
    passing_yards = models.FloatField(default=0)
    passing_tds = models.FloatField(default=0)
    passing_interceptions = models.FloatField(default=0)
    rushing_yards = models.FloatField(default=0)
    rushing_tds = models.FloatField(default=0)
    receptions = models.FloatField(default=0)
    receiving_yards = models.FloatField(default=0)
    receiving_tds = models.FloatField(default=0)
    fumbles_lost = models.FloatField(default=0)
    sacks = models.FloatField(default=0)
    interceptions = models.FloatField(default=0)
    blocks = models.FloatField(default=0)
    safeties = models.FloatField(default=0)
    defensive_tds = models.FloatField(default=0)
    return_tds = models.FloatField(default=0)
    points_allowed = models.FloatField(default=0)
    week_score = models.FloatField(default=0)

class PlayerStats(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    total = models.FloatField(default=0)
    wild_card_stats = models.OneToOneField(WeeklyStats, on_delete=models.CASCADE, related_name='wild_card', null = True)
    divisional_stats = models.OneToOneField(WeeklyStats, on_delete=models.CASCADE, related_name='divisional', null = True)
    conference_stats = models.OneToOneField(WeeklyStats, on_delete=models.CASCADE, related_name='conference', null = True)
    super_bowl_stats = models.OneToOneField(WeeklyStats, on_delete=models.CASCADE, related_name='super_bowl', null = True)

    def __str__(self):
        return self.name
    
class Standings(models.Model):
    entry_name = models.CharField(max_length=255)
    entry_score = models.FloatField()
    standings_place = models.IntegerField()