from django.contrib import admin
from .models import Player, Entry, RosteredPlayers, WeeklyStats


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'team')
    list_filter = ('position', 'team')
    search_fields = ('name',)

admin.site.register(Player, PlayerAdmin)



admin.site.register(Entry)
# Register your models here.


class RosteredPlayersAdmin(admin.ModelAdmin):
    list_display = ('player', 'entry', 'is_captain') 
    list_filter = ('is_captain',) 
    search_fields = ('player__name', 'entry__name') 

admin.site.register(RosteredPlayers, RosteredPlayersAdmin)


class WeeklyStatsAdmin(admin.ModelAdmin):
    list_display = ('player', 'week', 'week_score')
    list_filter = ('week',)
    search_fields = ('player__name',)

admin.site.register(WeeklyStats, WeeklyStatsAdmin)