from rest_framework import viewsets
from .models import Category, Developer, Game
from .serializers import CategorySerializer, DeveloperSerializer, GameSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class DeveloperViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    lookup_field = 'slug'


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    # select_related is for ForeignKey (1-to-Many)
    # prefetch_related is for ManyToMany relationships
    queryset = Game.objects.select_related(
        'category', 'developer', 'minimum_subscription_tier'
    ).prefetch_related(
        'genres', 'platforms'
    ).all()

    serializer_class = GameSerializer
    lookup_field = 'slug'