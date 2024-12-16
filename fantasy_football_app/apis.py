from rest_framework import generics, permissions
from .models import Entry
from .serializers import EntrySerializer

class EntryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # if self.request.user.is_superuser:
        return Entry.objects.all()
        # return Entry.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EntryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # if self.request.user.is_superuser:
        return Entry.objects.all()
        # return Entry.objects.filter(user=self.request.user)