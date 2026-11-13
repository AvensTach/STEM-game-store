from django.contrib import admin
from .models import Category, Developer, Genre, Platform, Game

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'developer', 'price')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category', 'developer')
    search_fields = ('title',)
    # Use filter_horizontal to create a comfortable UI for selecting multiple genres/platforms
    filter_horizontal = ('genres', 'platforms')