from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect


def admin_login_redirect(request):
    if request.user.is_authenticated:
        return redirect('admin') 
    return admin.site.login(request)
urlpatterns = [

    path('',include('settingApp.urls')),
    path('accounts/',include('accounts.urls')),
    path('admin/', admin.site.urls),
    path('company/',include('company.urls')),
    path('employees/',include('employees.urls')),
    path('attendance/',include('attendance.urls')),
    
]
