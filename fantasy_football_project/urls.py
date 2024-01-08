"""
URL configuration for fantasy_football_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# fantasy_football_project/urls.py
from django.contrib import admin
from django.urls import path, include
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
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),  # This line maps the root path to the index view
    path('register/', register, name='register'),
    path('sign_in/', sign_in, name='sign_in'),
    path('create_entry/', create_entry, name='create_entry'),
    path('user_home/', user_home, name='user_home'),
    path('delete_entry/<int:entry_id>/', delete_entry, name='delete_entry'),
    path('edit_entry/<int:entry_id>/', edit_entry, name='edit_entry'),
    path('standings/', standings, name='standings'),
    path('view_entry/<int:entry_id>/', view_entry, name='view_entry'),
]
