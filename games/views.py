from rest_framework import viewsets
from .models import Category, Game, SubscriptionPlan
from .serializers import CategorySerializer, GameSerializer, SubscriptionPlanSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'  # Allows querying the category by slug in the URL (e.g., /api/categories/action/)

class GameViewSet(viewsets.ReadOnlyModelViewSet):
    # Use select_related to optimize database queries since
    # we are fetching category data alongside the game
    queryset = Game.objects.select_related('category').all()
    serializer_class = GameSerializer
    lookup_field = 'slug'

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer