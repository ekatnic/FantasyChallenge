from django.contrib import admin
from .models import Player, Entry, RosteredPlayers


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'team')
    list_filter = ('position', 'team')
    search_fields = ('name',)

admin.site.register(Player, PlayerAdmin)



class EntryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)
    search_fields = ('name', 'user__username')
admin.site.register(Entry, EntryAdmin)# Register your models here.


class RosteredPlayersAdmin(admin.ModelAdmin):
    list_display = ('player', 'entry', 'is_captain') 
    list_filter = ('is_captain',) 
    search_fields = ('player__name', 'entry__name') 

admin.site.register(RosteredPlayers, RosteredPlayersAdmin)