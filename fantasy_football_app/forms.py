# forms.py
from django import forms
from .models import Player, Entry

class EntryForm(forms.ModelForm):
    quarterback = forms.ModelChoiceField(queryset=Player.objects.filter(position='QB'))
    running_back1 = forms.ModelChoiceField(queryset=Player.objects.filter(position='RB'))
    running_back2 = forms.ModelChoiceField(queryset=Player.objects.filter(position='RB'))
    wide_receiver1 = forms.ModelChoiceField(queryset=Player.objects.filter(position='WR'))
    wide_receiver2 = forms.ModelChoiceField(queryset=Player.objects.filter(position='WR'))
    tight_end = forms.ModelChoiceField(queryset=Player.objects.filter(position='TE'))
    flex1 = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    flex2 = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    flex3 = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    scaled_flex = forms.ModelChoiceField(queryset=Player.objects.filter(position__in=['RB', 'WR', 'TE']))
    kicker = forms.ModelChoiceField(queryset=Player.objects.filter(position='K'))
    defense = forms.ModelChoiceField(queryset=Player.objects.filter(position='D/ST'))

    def clean(self):
        cleaned_data = super().clean()
        teams = [player.team for player in cleaned_data.values() if player is not None]
        if len(teams) != len(set(teams)):
            raise forms.ValidationError("You can't select two players from the same team.")

    class Meta:
        model = Entry
        fields = ['quarterback', 'running_back1', 'running_back2', 'wide_receiver1', 'wide_receiver2', 'tight_end', 'flex1', 'flex2', 'flex3', 'scaled_flex', 'kicker', 'defense']