from django.db import models

class Employee(models.Model):
    user = models.OneToOneField('accounts.CustomUser', on_delete=models.CASCADE)
    company = models.ForeignKey('company.Company', on_delete=models.CASCADE, related_name='employees')

    def __str__(self):
        return self.user.username
