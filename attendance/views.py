from django.shortcuts import render



def attendance (request):

    context = {
        'title': 'attendance',

    }

    return render(request, 'attendance/index.html',context)


