from itertools import groupby

from django import forms
from django.db.models import QuerySet

from .models import Player


class GroupedModelChoiceField(forms.ModelChoiceField):
    def __init__(self, queryset, group_by_field, group_label=None, *args, **kwargs):
        super().__init__(queryset, *args, **kwargs)
        self.group_by_field = group_by_field
        if group_label is None:
            group_label = lambda group: group
        self.group_label = group_label

    def _get_choices(self):
        if hasattr(self, '_choices'):
            return self._choices

        return GroupedModelChoiceIterator(self)

    choices = property(_get_choices, forms.ModelChoiceField._set_choices)

class GroupedModelChoiceIterator(forms.models.ModelChoiceIterator):
    def __iter__(self):
        if self.field.empty_label is not None:
            yield ("", self.field.empty_label)
        queryset = self.field.queryset
        if not isinstance(queryset, QuerySet):
            queryset = queryset.all()
        queryset = queryset.order_by(self.field.group_by_field)
        group_by_field = self.field.group_by_field
        for group, choices in groupby(queryset, key=lambda row: getattr(row, group_by_field)):
            yield (self.field.group_label(group), [self.choice(ch) for ch in choices])

def get_custom_grouped_model_choice_field(position_val):
    return GroupedModelChoiceField(
        queryset=Player.objects.filter(position__in=position_val).order_by('team'),
        group_by_field='team',
    )