from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    USER_ROLES = (
        ('admin', 'Admin'),
        ('company', 'Company'),
        ('employee', 'Employee'),
    )
    role = models.CharField(max_length=10, choices=USER_ROLES, default='employee')
    company = models.ForeignKey('company.Company', on_delete=models.SET_NULL, null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)

    def __str__(self):
        return self.username