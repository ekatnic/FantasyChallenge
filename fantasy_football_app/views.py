from django import forms  # Import Django's built-in forms module
from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from django.core.cache import cache
from django.forms.models import model_to_dict
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from waffle import flag_is_active

from .tank_api.api_request import TankAPIClient
from .constants import (DEFENSE_STATS_NAMES, POSITION_ORDER,
                        SKILL_POS_STATS_NAMES, WEEK_CHOICES)
from .forms import EntryForm  
from .models import (
    Entry, 
    Player,
    RosteredPlayers,
    WeeklyStats
)
from .utils import (
    get_all_entry_score_dicts, get_entry_list_score_dict,
    get_entry_score_dict, get_entry_total_dict,
    get_summarized_players, update_and_return
)


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30)
    last_name = forms.CharField(max_length=30)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super(RegistrationForm, self).save(commit=False)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()  # This will handle the first_name, last_name, email, and password fields
            username = form.cleaned_data.get('username').lower()
            messages.success(request, f'Account created for {username}!')
            login(request, user)  # Log the user in
            return redirect('create_entry')
    else:
        form = RegistrationForm()
    return render(request, 'fantasy_football_app/register.html', {'form': form})

def index(request):
    if request.user.is_authenticated:
        return redirect('user_home')
    return render(request, 'fantasy_football_app/index.html')



class CaseInsensitiveModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(username__iexact=username)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None

class CustomAuthenticationForm(AuthenticationForm):
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        if username:
            cleaned_data['username'] = username.lower()
        return cleaned_data

def sign_in(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect('user_home')
            else:
                messages.error(request,"Invalid username or password.")

    form = CustomAuthenticationForm()
    return render(request = request, template_name = "fantasy_football_app/sign_in.html", context={"form":form})


@login_required
def create_entry(request):
    if flag_is_active(request, 'entry_lock'):
        messages.error(request, "Entry Creation is Locked")
        return redirect('user_home')
    
    if request.method == 'POST':
        form = EntryForm(request.POST)
        if form.is_valid():
            entry = form.save(commit=True, user=request.user)
            entry.save()

            player_fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']

            messages.success(request, 'Entry submitted successfully.')
            cache.delete('ranked_entries_dict')
            return redirect('user_home')
        else:
            messages.error(request, 'Error submitting entry. Please check the form.')
    else:
        form = EntryForm()

    context = {'form': form}
    return render(request, 'fantasy_football_app/create_entry.html', context)

@login_required
def user_home(request):
    all_entries_dict = get_all_entry_score_dicts()
    # filter for only entries by that user
    user_entries_dict = {entry: scoring_dict for entry, scoring_dict in all_entries_dict.items() if entry.user.id == request.user.id}
    context = {'entries': user_entries_dict}
    return render(request, 'fantasy_football_app/user_home.html', context)

@login_required
def delete_entry(request, entry_id):
    if flag_is_active(request, 'entry_lock'):
        messages.error(request, "Entry Deleting is Locked")
        return redirect('user_home')

    entry = get_object_or_404(Entry, id=entry_id, user=request.user)
    entry.delete()
    messages.success(request, 'Entry deleted successfully.')
    cache.delete('ranked_entries_dict')
    return redirect('user_home')

@login_required
def edit_entry(request, entry_id):
    if flag_is_active(request, 'entry_lock'):
        messages.error(request, "Entry Editing is Locked")
        return redirect('user_home')

    entry = get_object_or_404(Entry.objects.select_related('user'), id=entry_id)

    player_fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']

    if entry.user.id is not request.user.id:
        messages.error(request, 'You do not have permission to edit this entry.')
        return redirect('user_home')
    if request.method != 'POST':
        # Get the rostered players
        rostered_players = RosteredPlayers.objects.filter(entry=entry).order_by('id')

        # Create a dictionary to pre-populate the form fields
        initial_data = {field_name: rp.player for field_name, rp in zip(player_fields, rostered_players)}
        initial_data.update({f'captain_{field_name}': rp.is_captain for field_name, rp in zip(player_fields, rostered_players)})

        form = EntryForm(instance=entry, initial=initial_data)  # Pass instance to EntryForm
    else:
        form = EntryForm(instance=entry, data=request.POST)  # Pass instance to EntryForm
        if form.is_valid():
            RosteredPlayers.objects.filter(entry=entry).delete()
            form.save()
            cache.delete('ranked_entries_dict')
            return redirect('user_home')  # Redirect to user_home after successfully submitting the form

    context = {'entry': entry, 'form': form}
    return render(request, 'fantasy_football_app/edit_entry.html', context)

@login_required
def standings(request):
    all_entries_dict = get_all_entry_score_dicts()
    return render(request, 'fantasy_football_app/standings.html', {'entries': all_entries_dict})

@login_required
def view_entry(request, entry_id):
    entry = get_object_or_404(Entry.objects.prefetch_related('rosteredplayers_set__player__weeklystats_set'), id=entry_id)
    if not flag_is_active(request, 'entry_lock') and entry.user.id is not request.user.id:
        messages.error(request, 'You do not have permission to view this entry.')
        return redirect('user_home')
    player_total_dict = get_entry_score_dict(entry)
    entry_total_dict = get_entry_total_dict(player_total_dict) 
    zipped_player_list = zip(POSITION_ORDER, player_total_dict.items())
    context = {
        "player_list": zipped_player_list,
        "entry_total": entry_total_dict['total'],
    }
    return render(request, 'fantasy_football_app/view_entry.html', context) 

def sign_out(request):
    logout(request)
    return redirect('index')


def players_view(request):
    players_scoring_dict = cache.get('players_scoring_dict')
    if not players_scoring_dict:
        # Get a QuerySet of Players, annotated with the count of related RosteredPlayer instances
        players_scoring_dict = get_summarized_players()
        cache.set('players_scoring_dict', players_scoring_dict, 60 * 30)  # Cache for 30 minutes
    context = {
        'players_scoring_dict': players_scoring_dict,
    }
    return render(request, 'fantasy_football_app/players.html', {'players_scoring_dict': players_scoring_dict})

@login_required
def rules(request):
    return render(request, 'fantasy_football_app/rules.html')
  
def player_stats_view(request, player_id):
    player = get_object_or_404(Player.objects.prefetch_related('weeklystats_set'), id=player_id)
    weekly_stats = player.weeklystats_set.all().order_by('id')
    weekly_stats_dicts = [update_and_return(model_to_dict(stat), {'week_score': stat.week_score}) for stat in weekly_stats]
    context = {
        'player': player,
        'weekly_stats': weekly_stats_dicts,
        'field_name_mapping': DEFENSE_STATS_NAMES if player.position == 'DEF' else SKILL_POS_STATS_NAMES,
    }
    return render(request, 'fantasy_football_app/player_stats.html', context)

def entry_list_view(request):
    rostered_player_id = request.GET.get('rostered_player','')
    scaled_flex_id = request.GET.get('scaled_flex','')
    captain_id = request.GET.get('captain','')
    player_id = rostered_player_id or scaled_flex_id or captain_id
    player = get_object_or_404(Player, id=player_id)
    if rostered_player_id:
        filter_condition={'player_id':rostered_player_id}
        filter_message=f'Entries where {player.name} is rostered'
    elif scaled_flex_id:
        filter_condition={'player_id':scaled_flex_id, 'is_scaled_flex':True}
        filter_message=f'Entries where {player.name} is scaled flex'
    elif captain_id:
        filter_condition={'player_id':captain_id, 'is_captain':True}
        filter_message=f'Entries where {player.name} is captain'
    else:
        return redirect('players')
    rostered_player_set = RosteredPlayers.objects.filter(**filter_condition)
    entry_id_list = rostered_player_set.values_list('entry', flat=True)
    all_entries_dict = get_all_entry_score_dicts()
    entries_list = {entry: scoring for entry, scoring in all_entries_dict.items() if entry.id in entry_id_list}
    context = {
        'entries': entries_list,
        'filter_message': filter_message,
        }
    return render(request, 'fantasy_football_app/entry_list.html', context)

@user_passes_test(lambda u: u.is_superuser)
def load_players_api_view(request):
    result = None
    if request.method == 'POST':
        week = request.POST.get('week')
        game_date = request.POST.get('game_date')
        cache.delete('ranked_entries_dict')
        cache.delete('players_scoring_dict')
        client = TankAPIClient()
        result = client.process_player_stats_for_date(game_date, week)
        result.sort()

    # Default date to today in 'YYYYMMDD' format
    default_date = timezone.now().strftime('%Y%m%d')

    context = {
        'week_choices': WEEK_CHOICES,
        'default_date': default_date,
        'result': result,
    }
    return render(request, 'fantasy_football_app/load_players_api.html', context)

def react_view(request):
    return render(request, 'index.html')