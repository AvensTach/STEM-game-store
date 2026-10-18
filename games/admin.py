from django.contrib import admin
from .models import Category, Game, SubscriptionPlan

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'available_in_subscription')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category', 'available_in_subscription')

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_days', 'is_active')