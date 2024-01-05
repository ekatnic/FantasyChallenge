# fantasy_football_app/urls.py
from django.urls import path
from .views import (
    index,
    register,
    sign_in,
    create_entry,
    user_home,
    delete_entry,
    edit_entry,
    standings,
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
    # Add other app-level URL patterns as needed
]
