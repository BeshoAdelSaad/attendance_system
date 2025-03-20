from django.urls import path
from . import views

urlpatterns = [

    path('', views.company, name='company'),
    path('company-list/', views.company_list, name='company_list'),
    path('add-company/', views.add_company, name='add_company'),
    path('edit-company/<int:company_id>/', views.edit_company, name='edit_company'),
    path('delete-company/<int:company_id>/', views.delete_company, name='delete_company'),

    path('company_locations/', views.company_locations, name='company_locations'),
    path('add_location', views.add_location, name='add_location'),



]