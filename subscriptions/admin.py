from django.contrib import admin
from .models import SubscriptionTier, UserSubscription

@admin.register(SubscriptionTier)
class SubscriptionTierAdmin(admin.ModelAdmin):
    list_display = ('name', 'access_level', 'price', 'is_active')
    list_filter = ('is_active', 'access_level')
    search_fields = ('name',)

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'tier', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'tier')
    search_fields = ('user__username',)