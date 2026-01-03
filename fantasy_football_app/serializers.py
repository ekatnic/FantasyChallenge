from rest_framework import serializers
from .models import (
    Entry,
    PlayerInfo, 
    PlayerStats,
    Player,
    RosteredPlayers,
    WeeklyStats,
)
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class WeeklyStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyStats
        fields = '__all__'

class PlayerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerInfo
        fields = '__all__'

class PlayerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerStats
        fields = '__all__'

class PlayerSerializer(serializers.ModelSerializer):
    info = PlayerInfoSerializer(read_only=True)  # one to one with Players model 

    # many to one with Players model (one player can have many stats entries, different seasons, regular season, post season, etc.) 
    stats = PlayerStatsSerializer(many=True, read_only=True) 

    class Meta:
        model = Player
        fields = '__all__'

    def __str__(self):
        return f'{self.name} ({self.position}) - {self.team}'

class RosteredPlayersSerializer(serializers.ModelSerializer):
    player_id = serializers.IntegerField(source='player.id')
    player_name = serializers.CharField(source='player.name')

    class Meta:
        model = RosteredPlayers
        fields = ['id', 'player_id', 'player_name', 'roster_position']

class EntrySerializer(serializers.ModelSerializer):
    rostered_players = RosteredPlayersSerializer(many=True, read_only=True, source='rosteredplayers_set')

    class Meta:
        model = Entry
        fields = [
            'id', 
            'name', 
            'rostered_players', 
            'wild_card_score', 
            'divisional_score', 
            'conference_score', 
            'super_bowl_score', 
            'total'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        data = request.data
        user_entry_count = Entry.objects.filter(user=user).count()
        roster_name = data.get("rosterName") or f"{request.user.first_name} {request.user.last_name}'s Entry #{user_entry_count + 1}"
        entry = Entry.objects.create(user=request.user, name=roster_name, year="2026")
        for position, player_id in data.get("roster").items():
            if player_id is not None:
                RosteredPlayers.objects.create(
                    entry=entry, 
                    player=Player.objects.get(id=player_id), 
                    roster_position=position,
                )
        return entry

    def update(self, instance, validated_data):
        request = self.context.get('request')
        data = request.data
        roster_name = data.get("rosterName") or instance.name
        
        # Update the entry name
        instance.name = roster_name
        instance.save()

        # Clear existing rostered players
        RosteredPlayers.objects.filter(entry=instance).delete()

        # Add new rostered players
        for position, player_id in data.get("roster").items():
            if player_id is not None:
                RosteredPlayers.objects.create(
                    entry=instance, 
                    player=Player.objects.get(id=player_id), 
                    roster_position=position,
                )
        return instance

# ---------------------------------------------------------------
# ---- Auth serializers ----
# ---------------------------------------------------------------
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class SignupSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Force username to be email
        attrs['username'] = attrs['email'].lower()
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['email'].lower(),
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password1'])
        user.save()

        return user


class ConfirmSignupSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    confirmation_code = serializers.CharField(max_length=6, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password1 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Force username to be email
        attrs['username'] = attrs['email'].lower()
        return attrs
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        attrs['username'] = attrs['username'].lower()
        return attrs



class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        # Convert to lowercase for consistency
        return value.lower()


class ConfirmForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    confirmation_code = serializers.CharField(required=True)
    password = serializers.CharField(required=True, validators=[validate_password])

    def validate_email(self, value):
        # Convert to lowercase for consistency
        return value.lower()

class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
