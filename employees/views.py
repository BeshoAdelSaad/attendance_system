from django.shortcuts import render



def employees (request):

    context = {
        'title': 'employees',

    }

    return render(request, 'employees/index.html',context)


