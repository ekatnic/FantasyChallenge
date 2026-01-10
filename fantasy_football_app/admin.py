from django.contrib import admin

from .models import (
    Entry, 
    Player,
    PlayerInfo,
    PlayerStats,
    RosteredPlayers,
    WeeklyStats
)


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'team')
    list_filter = ('position', 'team')
    search_fields = ('name',)

admin.site.register(Player, PlayerAdmin)


class EntryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'year')
    list_filter = ('user','year')
    search_fields = ('name', 'user__username')
admin.site.register(Entry, EntryAdmin)# Register your models here.


class RosteredPlayersAdmin(admin.ModelAdmin):
    list_display = ('player', 'entry', 'is_captain', 'is_scaled_flex') 
    list_filter = ('is_captain', 'is_scaled_flex') 
    search_fields = ('player__name', 'entry__name') 

admin.site.register(RosteredPlayers, RosteredPlayersAdmin)


class WeeklyStatsAdmin(admin.ModelAdmin):
    list_display = ('player', 'week', 'week_score')
    list_filter = ('week',)
    search_fields = ('player__name',)
    readonly_fields = ('week_score',)

admin.site.register(WeeklyStats, WeeklyStatsAdmin)

class PlayerStatsAdmin(admin.ModelAdmin):
    list_display = ('player', 'season')
    list_filter = ('season',)
    search_fields = ('player__name',)

admin.site.register(PlayerStats, PlayerStatsAdmin)

class PlayerInfoAdmin(admin.ModelAdmin):
    list_display = ('player', 'school')
    search_fields = ('player__name',)

admin.site.register(PlayerInfo, PlayerInfoAdmin)