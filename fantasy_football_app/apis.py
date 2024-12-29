from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Entry, Player
from .utils import get_entry_score_dict, get_entry_total_dict
from .serializers import EntrySerializer, PlayerSerializer, RosteredPlayersSerializer
from django.core.cache import cache

class EntryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = Entry.objects.filter(user=self.request.user).prefetch_related('rosteredplayers_set')
        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(year=year)
        return queryset

    def perform_create(self, serializer):
        serializer.save()
        cache.delete("ranked_entries_dict")

class EntryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # if self.request.user.is_superuser:
        #     return Entry.objects.all()
        return Entry.objects.filter(user=self.request.user)

class PlayerListAPIView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class EntryRosterAPIView(generics.RetrieveAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Entry.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        entry = get_object_or_404(Entry.objects.prefetch_related('rosteredplayers_set__player__weeklystats_set'), id=kwargs['pk'], user=request.user)
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
