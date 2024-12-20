from rest_framework import serializers
from .models import (
    Entry,
    Player,
    RosteredPlayers,
)
from django.contrib.auth import get_user_model

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ['id','name']

    def create(self, validated_data):
        request = self.context.get('request')
        entry = Entry.objects.create(user=request.user, name="test2")
        for field_name, player in validated_data.items():
            if player is not None and field_name != 'user':
                RosteredPlayers.objects.create(
                    entry=entry, 
                    player=player, 
                    is_scaled_flex=field_name == 'scaled_flex'
                )
        return entry

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'