from rest_framework import serializers
from .models import Category, Developer, Genre, Platform, Game
from subscriptions.serializers import SubscriptionTierSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ['id', 'name', 'slug']


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'slug']


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ['id', 'name', 'slug']


class GameSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    developer = DeveloperSerializer(read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    platforms = PlatformSerializer(many=True, read_only=True)
    minimum_subscription_tier = SubscriptionTierSerializer(read_only=True)

    class Meta:
        model = Game
        fields = [
            'id', 'title', 'slug', 'category', 'developer',
            'genres', 'platforms', 'price', 'minimum_subscription_tier',
            'description', 'cover_image_url', 'release_date'
        ]