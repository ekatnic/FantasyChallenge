# forms.py
from django import forms

from .constants import FLEX_POSITIONS
from .custom_field_choices import (GroupedModelChoiceField,
                                   get_custom_grouped_model_choice_field)
from .models import Entry, Player, RosteredPlayers


class EntryForm(forms.ModelForm):
    quarterback = get_custom_grouped_model_choice_field(['QB'])
    running_back1 = get_custom_grouped_model_choice_field(['RB'])
    captain_running_back1 = forms.BooleanField(required=False)
    running_back2 = get_custom_grouped_model_choice_field(['RB'])
    captain_running_back2 = forms.BooleanField(required=False)
    wide_receiver1 = get_custom_grouped_model_choice_field(['WR'])
    captain_wide_receiver1 = forms.BooleanField(required=False)
    wide_receiver2 = get_custom_grouped_model_choice_field(['WR'])
    captain_wide_receiver2 = forms.BooleanField(required=False)
    tight_end = get_custom_grouped_model_choice_field(['TE'])
    captain_tight_end = forms.BooleanField(required=False)
    flex1 = get_custom_grouped_model_choice_field(FLEX_POSITIONS)
    captain_flex1 = forms.BooleanField(required=False)
    flex2 =  get_custom_grouped_model_choice_field(FLEX_POSITIONS)
    captain_flex2 = forms.BooleanField(required=False)
    flex3 =  get_custom_grouped_model_choice_field(FLEX_POSITIONS)
    captain_flex3 = forms.BooleanField(required=False)
    flex4 =  get_custom_grouped_model_choice_field(FLEX_POSITIONS)
    captain_flex4 = forms.BooleanField(required=False)
    scaled_flex =  get_custom_grouped_model_choice_field(FLEX_POSITIONS)
    defense =  get_custom_grouped_model_choice_field(['DEF'])
    captain_defense = forms.BooleanField(required=False)

    def save(self, user=None, commit=True):
        entry = super().save(commit=False)
        entry.user = user if user else entry.user

        if commit:
            entry.save()

            for field_name in self.cleaned_data:
                player = self.cleaned_data[field_name]
                if player is not None and not field_name.startswith('captain_'):
                    is_captain = self.data.get('captain_' + field_name) == 'on'
                    is_scaled_flex = field_name == 'scaled_flex'
                    RosteredPlayers.objects.create(
                        entry=entry, 
                        player=player, 
                        is_captain=is_captain,
                        is_scaled_flex=is_scaled_flex
                    )
        return entry
    
    def clean(self):
        cleaned_data = super().clean()

        # Existing team validation
        team_dict = {}
        for field, player in cleaned_data.items():
            if field.startswith('captain_'):
                continue
            if team_dict.get(player.team):
                self.add_error(field, f"You cannot take two players from {player.team}.")
                self.add_error(team_dict[player.team], f"You cannot take two players from {player.team}.")
                raise forms.ValidationError(f"You cannot take two players from {player.team}")
            team_dict[player.team] = field
        # Captain validation
        player_fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']
        captain_fields = [f'captain_{field_name}' for field_name in player_fields]
        if not any(cleaned_data.get(field) for field in captain_fields):
            raise forms.ValidationError("At least one captain must be selected.")

    class Meta:
        model = Entry
        fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'flex4', 'scaled_flex', 'defense']