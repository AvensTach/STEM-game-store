from rest_framework import serializers
from .models import Category, Game, SubscriptionPlan

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class GameSerializer(serializers.ModelSerializer):
    # Вкладаємо серіалізатор категорії, щоб React отримував відразу всю інформацію
    # про категорію, а не лише її ID (наприклад, для відображення назви)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Game
        fields = [
            'id', 'title', 'slug', 'category', 'developer',
            'price', 'available_in_subscription', 'description',
            'cover_image', 'release_date'
        ]

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'price', 'duration_days', 'description']