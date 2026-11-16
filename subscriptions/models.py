from django.db import models

# Create your models here.


from django.db import models
from django.contrib.auth.models import User


class SubscriptionTier(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Tier Name")

    # Hierarchical access logic (e.g., 1=Basic, 2=Standard, 3=Premium)
    # A user with level 3 can access games requiring level 1, 2, or 3
    access_level = models.PositiveSmallIntegerField(unique=True, db_index=True, verbose_name="Access Level")

    price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Monthly Price")
    is_active = models.BooleanField(default=True, db_index=True, verbose_name="Is Active")
    description = models.TextField(blank=True, verbose_name="Description")

    class Meta:
        ordering = ['access_level']

    def __str__(self):
        return f"{self.name} (Level {self.access_level})"


class UserSubscription(models.Model):
    # OneToOne ensures a user can only have one active subscription state at a time
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="subscription")
    tier = models.ForeignKey(SubscriptionTier, on_delete=models.RESTRICT)

    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        # Composite index for fast queries checking if a user has an active subscription right now
        indexes = [
            models.Index(fields=['user', 'is_active', 'end_date']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.tier.name}"