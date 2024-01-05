# fantasy_football_app/urls/__init__.py
from django.urls import include, path

urlpatterns = [
    path('register/', include('fantasy_football_app.urls.register')),
]
