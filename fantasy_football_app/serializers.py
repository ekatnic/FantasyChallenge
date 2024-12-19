from rest_framework import serializers
from .models import (
    Entry,
    Player,
    RosteredPlayers,
)
from django.contrib.auth import get_user_model

class EntrySerializer(serializers.ModelSerializer):
    quarterback = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position='QB'))
    running_back1 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position='RB'))
    running_back2 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position='RB'))
    wide_receiver1 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position='WR'))
    wide_receiver2 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position='WR'))
    tight_end = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position='TE'))
    flex1 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position__in=['RB','WR','TE']))
    flex2 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position__in=['RB','WR','TE']))
    flex3 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position__in=['RB','WR','TE']))
    flex4 = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position__in=['RB','WR','TE']))
    scaled_flex = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position__in=['RB','WR','TE']))
    defense = serializers.PrimaryKeyRelatedField(queryset=Player.objects.filter(position='DEF'))
    user = serializers.HiddenField(default=get_user_model().objects.get(username='adminnew'))

    class Meta:
        model = Entry
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user if self.context['request'].user.is_authenticated else get_user_model().objects.get(username='adminnew')
        entry = Entry.objects.create(user=user, name="test")
        for field_name, player in validated_data.items():
            if player is not None and field_name is not 'user':
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