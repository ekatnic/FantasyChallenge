from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import F, Sum
from waffle import flag_is_active
from .models import Entry, Player, RosteredPlayers, WeeklyStats
from .utils import (
    get_entry_score_dict, 
    get_entry_total_dict, 
    get_all_entry_score_dicts, 
    get_summarized_players,
    get_survivor_standings, 
    filter_by_rostered_player, 
    filter_by_scaled_flex
)
from .serializers import WeeklyStatsSerializer, EntrySerializer, PlayerSerializer, RosteredPlayersSerializer
from django.core.cache import cache

class EntryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE'] and flag_is_active(self.request, 'entry_lock'):
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [perm() for perm in permission_classes]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = Entry.objects.filter().prefetch_related('rosteredplayers_set')
        mine_only = self.request.query_params.get('mine_only')
        if mine_only and mine_only.lower() == 'true':
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()
        cache.delete("ranked_entries_dict")

class IsOwnerOrAdmin(permissions.BasePermission):
    """Object-level permission to only allow owners of an object or admins to access it."""

    def has_object_permission(self, request, view, obj):
        # Allow admins full access
        if request.user and request.user.is_superuser:
            return True
        # Otherwise only allow owners
        return getattr(obj, "user", None) == request.user


class EntryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer

    def get_permissions(self):
        # When roster creation/editing is locked, only admins may perform unsafe methods
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE'] and flag_is_active(self.request, 'entry_lock'):
            permission_classes = [IsAdminUser]
        else:
            # Require authentication and enforce object-level ownership for object actions
            permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        # Superusers can access all entries; normal users only their own entries
        if self.request.user.is_superuser:
            return Entry.objects.all()
        return Entry.objects.filter(user=self.request.user)

class PlayerListAPIView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def get_queryset(self):
        queryset = Player.objects.select_related('info').prefetch_related('stats')
        teams = self.request.query_params.get('teams')
        if teams:
            team_list = teams.split(',')
            queryset = queryset.filter(team__in=team_list)
        return queryset

class EntryRosterAPIView(generics.RetrieveAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        # Superusers can access all entries; normal users only their own entries
        if self.request.user.is_superuser:
            return Entry.objects.all().prefetch_related('rosteredplayers_set__player__weeklystats_set')
        return Entry.objects.filter(user=self.request.user).prefetch_related('rosteredplayers_set__player__weeklystats_set')

    def retrieve(self, request, *args, **kwargs):
        # Use DRF's object retrieval which enforces object-level permissions
        entry = self.get_object()
        player_total_dict = get_entry_score_dict(entry)
        entry_total_dict = get_entry_total_dict(player_total_dict)

        player_list = [
            {
                "player": RosteredPlayersSerializer(player).data,
                "score": score
            }
            for player, score in player_total_dict.items()
        ]

        data = {
            "entry_name": entry.name,
            "player_list": player_list,
            "entry_scores": entry_total_dict,
        }
        return Response(data)

class StandingsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        all_entries_list = get_all_entry_score_dicts()

        # Get query parameters
        rostered_player_id = request.query_params.get('rostered_player')
        scaled_flex_id = request.query_params.get('scaled_flex')
        mine_only = request.query_params.get('mine_only')

        if rostered_player_id:
            all_entries_list = filter_by_rostered_player(all_entries_list, rostered_player_id)

        # Filter entries based on scaled_flex
        if scaled_flex_id:
            all_entries_list = filter_by_scaled_flex(all_entries_list, scaled_flex_id)

        for entry in all_entries_list:
            entry['is_user_entry'] = entry['user_id'] == request.user.id
        if mine_only and mine_only.lower() == 'true':
            all_entries_list = [entry for entry in all_entries_list if entry['is_user_entry']]

        return Response({'entries': all_entries_list})

class PlayerOwnershipAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        season = request.query_params.get('season', '2026')
        return Response({'players_scoring_dict': get_summarized_players(season=season)})

class PlayerWeeklyStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, player_id, *args, **kwargs):
        player = get_object_or_404(Player, id=player_id)
        season = request.query_params.get('season', '2026')
        weekly_stats = WeeklyStats.objects.filter(player=player, season=season)
        player_data = PlayerSerializer(player).data
        weekly_stats_data = WeeklyStatsSerializer(weekly_stats, many=True).data
        return Response({'player': player_data, 'weekly_stats': weekly_stats_data})

class SurvivorStandingsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        rostered_player_id = request.query_params.get('rostered_player')
        scaled_flex_id = request.query_params.get('scaled_flex')
        season = request.query_params.get('season', '2026')

        # get standings data from cache OR calculate and cache it
        standings_data = get_survivor_standings(season=season)

        # Filter entries based on rostered_player_id
        if rostered_player_id:
            standings_data = filter_by_rostered_player(standings_data, rostered_player_id)

        # Filter entries based on scaled_flex
        if scaled_flex_id:
            standings_data = filter_by_scaled_flex(standings_data, scaled_flex_id)

        for entry in standings_data:
            entry['is_user_entry'] = entry['user_id'] == request.user.id
        return Response({'entries': standings_data})
