from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Entry, Player
from .serializers import EntrySerializer, PlayerSerializer
from django.core.cache import cache

class EntryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    # permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        # if self.request.user.is_superuser:
        return Entry.objects.all()
        # return Entry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()
        cache.delete("ranked_entries_dict")

class EntryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # if self.request.user.is_superuser:
        return Entry.objects.all()
        # return Entry.objects.filter(user=self.request.user)

class PlayerListAPIView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer