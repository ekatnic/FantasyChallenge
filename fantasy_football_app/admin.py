from django.contrib import admin
from .models import Player, Entry


class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'team')
    list_filter = ('position', 'team')
    search_fields = ('name',)

admin.site.register(Player, PlayerAdmin)



admin.site.register(Entry)
# Register your models here.
