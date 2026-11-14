from rest_framework import viewsets, permissions
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
    # This single ViewSet now automatically handles both lists AND ID lookups
    queryset = Game.objects.select_related(
        'category', 'developer', 'minimum_subscription_tier'
    ).prefetch_related(
        'genres', 'platforms'
    ).all()
    serializer_class = GameSerializer
    # DELETED: lookup_field = 'slug'