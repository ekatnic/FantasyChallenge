from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import F, Sum
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
        # Added to prevent normal users from creating entries after roster lock
        if (
            self.request.method == 'PUT'
            or self.request.method == 'PATCH'
            or self.request.method == 'POST'
        ):
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

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

class EntryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer

    #Added to prevent normal users from updating/deleting entries after roster lock
    def get_permissions(self):
        if (
            self.request.method == 'PUT'
            or self.request.method == 'PATCH'
            or self.request.method == 'DELETE'
            or self.request.method == 'POST'
            ):
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        # if self.request.user.is_superuser:
        #     return Entry.objects.all()
        return Entry.objects.filter()

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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Entry.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        entry = get_object_or_404(Entry.objects.prefetch_related('rosteredplayers_set__player__weeklystats_set'), id=kwargs['pk'])
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
        return Response({'players_scoring_dict': get_summarized_players()})

class PlayerWeeklyStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, player_id, *args, **kwargs):
        player = get_object_or_404(Player, id=player_id)
        weekly_stats = WeeklyStats.objects.filter(player=player)
        player_data = PlayerSerializer(player).data
        weekly_stats_data = WeeklyStatsSerializer(weekly_stats, many=True).data
        return Response({'player': player_data, 'weekly_stats': weekly_stats_data})

class SurvivorStandingsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        rostered_player_id = request.query_params.get('rostered_player')
        scaled_flex_id = request.query_params.get('scaled_flex')

        # get standings data from cache OR calculate and cache it
        standings_data = get_survivor_standings()

        # Filter entries based on rostered_player_id
        if rostered_player_id:
            standings_data = filter_by_rostered_player(standings_data, rostered_player_id)

        # Filter entries based on scaled_flex
        if scaled_flex_id:
            standings_data = filter_by_scaled_flex(standings_data, scaled_flex_id)

        for entry in standings_data:
            entry['is_user_entry'] = entry['user_id'] == request.user.id
        return Response({'entries': standings_data})
