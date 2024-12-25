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
from django.urls import path, include, re_path
from django.contrib.auth import views as auth_views
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
    react_view,
)
from fantasy_football_app.apis import(
    EntryListCreateAPIView,
    EntryRetrieveUpdateDestroyAPIView,
    PlayerListAPIView,
)

from fantasy_football_app.auth_views import (
    SignupView,
    LoginView,
    LogoutView,
    AuthStatusView,
    ForgotPasswordView,
    ConfirmForgotPasswordView,
    ChangePasswordView,
    CSRFTokenView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('load_players_api/', load_players_api_view, name='load_players_api'),
    
    # TODO: Maybe these should be "api/auth/<route-name>" ? 
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('api/confirm-forgot-password/', ConfirmForgotPasswordView.as_view(), name='confirm_forgot_password'),
    path('api/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('api/auth-status/', AuthStatusView.as_view(), name='auth_status'),
    path('api/csrf-token/', CSRFTokenView.as_view(), name='csrf-token'),

    path('api/entries/', EntryListCreateAPIView.as_view(), name='entry-list-create'),
    path('api/entries/<int:pk>/', EntryRetrieveUpdateDestroyAPIView.as_view(), name='entry-detail'),
    path('api/players/', PlayerListAPIView.as_view(), name='list-player-view'),
    path('create-entry/', react_view, name='create_entry'),
    path('edit-entry/<int:entry_id>', react_view, name='edit_entry'),
    re_path(r'^.*$', react_view),
]
