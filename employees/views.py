from django.shortcuts import render
from .models import Employee


def employees (request):

    context = {
        'title': 'employees',

    }
    return render(request, 'employees/index.html',context)

def add_employee(request):
    pass

def store_employee(request):
    pass

def edit_employee(request, id):
    pass

def update_employee(request, id):
    pass

def delete_employee(request, id):
    pass

