from django.urls import path
from . import views

urlpatterns = [

    path('', views.employees, name='employees'),
    path('add-employee', views.add_employee, name='add_employee'),
    path('store-employee', views.store_employee, name='store_employee'),
    path('edit-employee/<int:id>', views.edit_employee, name='edit_employee'),
    path('update-employee/<int:id>', views.update_employee, name='update_employee'),
    path('delete-employee/<int:id>', views.delete_employee, name='delete_employee'),

]