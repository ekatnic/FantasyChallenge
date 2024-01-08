# forms.py
from django import forms
from .models import Player, Entry, RosteredPlayers

class EntryForm(forms.ModelForm):
    quarterback = forms.ModelChoiceField(queryset=Player.objects.filter(position='QB'))
    running_back1 = forms.ModelChoiceField(queryset=Player.objects.filter(position='RB'))
    captain_running_back1 = forms.BooleanField(required=False)
    running_back2 = forms.ModelChoiceField(queryset=Player.objects.filter(position='RB'))
    captain_running_back2 = forms.BooleanField(required=False)
    wide_receiver1 = forms.ModelChoiceField(queryset=Player.objects.filter(position='WR'))
    captain_wide_receiver1 = forms.BooleanField(required=False)
    wide_receiver2 = forms.ModelChoiceField(queryset=Player.objects.filter(position='WR'))
    captain_wide_receiver2 = forms.BooleanField(required=False)
    tight_end = forms.ModelChoiceField(queryset=Player.objects.filter(position='TE'))
    captain_tight_end = forms.BooleanField(required=False)
    flex1 = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    captain_flex1 = forms.BooleanField(required=False)
    flex2 = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    captain_flex2 = forms.BooleanField(required=False)
    flex3 = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    captain_flex3 = forms.BooleanField(required=False)
    flex4 = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    captain_flex4 = forms.BooleanField(required=False)
    scaled_flex = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    defense = forms.ModelChoiceField(queryset=Player.objects.filter(position='DEF'))
    captain_defense = forms.BooleanField(required=False)

    def save(self, commit=True):
        entry = super().save(commit=False)

        if commit:
            entry.save()

            for field_name in self.cleaned_data:
                player = self.cleaned_data[field_name]
                import pdb; pdb.set_trace()
                if player is not None and not field_name.startswith('captain_'):
                    is_captain = self.data.get('captain_' + field_name) == 'on'
                    RosteredPlayers.objects.create(
                        entry=entry, 
                        player=player, 
                        is_captain=is_captain
                    )

        return entry
    
    def clean(self):
        cleaned_data = super().clean()

        # Existing team validation
        teams = [player.team for player in cleaned_data.values() if isinstance(player, Player)]
        if len(teams) != len(set(teams)):
            raise forms.ValidationError("You cannot take two players from the same team.")

        # Captain validation
        player_fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']
        captain_fields = [f'captain_{field_name}' for field_name in player_fields]
        if not any(cleaned_data.get(field) for field in captain_fields):
            raise forms.ValidationError("At least one captain must be selected.")

    class Meta:
        model = Entry
        fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']