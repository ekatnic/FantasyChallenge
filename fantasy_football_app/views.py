# fantasy_football_app/views.py
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django import forms  # Import Django's built-in forms module
from django.contrib.auth import authenticate, login, logout
from .forms import EntryForm  # Make sure to import EntryForm at the top of your file
from .models import Entry, Standings, RosteredPlayers
from .utils import create_player_totals_dict_list
    
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
            print("Form is valid")  # Debugging print statement
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')  # Get the password from the form
            user = authenticate(request, username=username, password=password)  # Authenticate the user
            if user is not None:
                print("User is authenticated")  # Debugging print statement
                login(request, user)  # Log in the user
            else:
                print("User is not authenticated")  # Debugging print statement
            messages.success(request, f'Account created for {username}!')
            return redirect('create_entry')
        else:
            print("Form is not valid")  # Debugging print statement
    else:
        form = RegistrationForm()
    return render(request, 'fantasy_football_app/register.html', {'form': form})

def index(request):
    if request.user.is_authenticated:
        return redirect('user_home')
    return render(request, 'fantasy_football_app/index.html')

from django.contrib.auth.forms import AuthenticationForm

def sign_in(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect('user_home')
            else:
                messages.error(request,"Invalid username or password.")
        else:
            messages.error(request,"Invalid username or password.")
    form = AuthenticationForm()
    return render(request = request, template_name = "fantasy_football_app/sign_in.html", context={"form":form})


@login_required
def create_entry(request):
    if request.method == 'POST':
        form = EntryForm(request.POST)
        if form.is_valid():
            entry = form.save(commit=True, user=request.user)
            entry.save()

            player_fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']

            messages.success(request, 'Entry submitted successfully.')
            return redirect('user_home')
        else:
            messages.error(request, 'Error submitting entry. Please check the form.')
    else:
        form = EntryForm()

    context = {'form': form}
    return render(request, 'fantasy_football_app/create_entry.html', context)

@login_required
def user_home(request):
    entries = Entry.objects.filter(user=request.user)  # Replace Entry with your actual model
    context = {'entries': entries}
    return render(request, 'fantasy_football_app/user_home.html', context)

@login_required
def delete_entry(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id, user=request.user)
    entry.delete()
    messages.success(request, 'Entry deleted successfully.')
    return redirect('user_home')

@login_required
def edit_entry(request, entry_id):
    entry = get_object_or_404(Entry.objects.select_related('user'), id=entry_id)

    player_fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']

    if entry.user.id is not request.user.id:
        messages.error(request, 'You do not have permission to edit this entry.')
        return redirect('user_home')
    if request.method != 'POST':
        # Get the rostered players
        rostered_players = RosteredPlayers.objects.filter(entry=entry)

        # Create a dictionary to pre-populate the form fields
        initial_data = {field_name: rp.player for field_name, rp in zip(player_fields, rostered_players)}
        initial_data.update({f'captain_{field_name}': rp.is_captain for field_name, rp in zip(player_fields, rostered_players)})

        form = EntryForm(instance=entry, initial=initial_data)  # Pass instance to EntryForm
    else:
        form = EntryForm(instance=entry, data=request.POST)  # Pass instance to EntryForm
        if form.is_valid():
            RosteredPlayers.objects.filter(entry=entry).delete()
            form.save()
            return redirect('user_home')  # Redirect to user_home after successfully submitting the form

    context = {'entry': entry, 'form': form}
    return render(request, 'fantasy_football_app/edit_entry.html', context)

@login_required
def standings(request):
    standings = Standings.objects.all().order_by('standings_place')
    return render(request, 'fantasy_football_app/standings.html', {'standings': standings})

@login_required
def view_entry(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id)
    if entry.user.id is not request.user.id:
        messages.error(request, 'You do not have permission to view this entry.')
        return redirect('user_home')
    context = {
        "player_total_dict": create_player_totals_dict_list(entry),
        "entry_total": entry.total,
    }
    return render(request, 'fantasy_football_app/view_entry.html', context) 

def sign_out(request):
    logout(request)
    return redirect('index')
