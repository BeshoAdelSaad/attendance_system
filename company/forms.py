from django import forms
from .models import WorkLocation, Company
from django.contrib.auth import get_user_model

class WorkLocationForm(forms.ModelForm):
    class Meta:
        model = WorkLocation
        fields = ['name', 'latitude', 'longitude', 'radius']



User = get_user_model()

class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ["name"]
        