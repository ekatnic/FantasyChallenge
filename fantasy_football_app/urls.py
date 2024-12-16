# fantasy_football_app/urls.py
from django.urls import path

from fantasy_football_app.views import (
    index, 
    sign_in, 
    register, 
    create_entry, 
    user_home, 
    delete_entry, 
    edit_entry, 
    standings, 
    view_entry,
    sign_out,
    players_view,
    rules,
    player_stats_view,
    entry_list_view,
    load_players_api_view,
    EntryListCreateAPIView,
    EntryRetrieveUpdateDestroyAPIView,
)

urlpatterns = [
    path('', index, name='index'),  # This line maps the root path to the index view
    path('register/', register, name='register'),
    path('sign_in/', sign_in, name='sign_in'),
    path('create_entry/', create_entry, name='create_entry'),
    path('user_home/', user_home, name='user_home'),
    path('delete_entry/<int:entry_id>/', delete_entry, name='delete_entry'),
    path('edit_entry/<int:entry_id>/', edit_entry, name='edit_entry'),
    path('standings/', standings, name='standings'),
    path('api/entries/', EntryListCreateAPIView.as_view(), name='entry-list-create'),
    path('api/entries/<int:pk>/', EntryRetrieveUpdateDestroyAPIView.as_view(), name='entry-detail'),
]
