# games/views.py
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from .models import Category, Developer, Game, Genre, Platform
from .serializers import CategorySerializer, DeveloperSerializer, GameSerializer, GenreSerializer, PlatformSerializer


class GamePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class DeveloperViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    lookup_field = 'slug'


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    lookup_field = 'slug'


class PlatformViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    lookup_field = 'slug'


class GameViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GameSerializer
    pagination_class = GamePagination  # NEW: Apply pagination to this view

    def get_queryset(self):
        queryset = Game.objects.select_related(
            'category', 'developer', 'minimum_subscription_tier'
        ).prefetch_related('genres', 'platforms').all()

        search = self.request.query_params.get('search')
        genres = self.request.query_params.get('genres')
        platforms = self.request.query_params.get('platforms')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        tier_level = self.request.query_params.get('tier_level')
        ordering = self.request.query_params.get('ordering')
        is_featured_param = self.request.query_params.get('is_featured')

        if search:
            queryset = queryset.filter(title__icontains=search)

        if genres:
            genre_list = genres.split(',')
            for genre_slug in genre_list:
                queryset = queryset.filter(genres__slug=genre_slug)

        if platforms:
            platform_list = platforms.split(',')
            for platform_slug in platform_list:
                queryset = queryset.filter(platforms__slug=platform_slug)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if tier_level:
            queryset = queryset.filter(
                minimum_subscription_tier__isnull=False,
                minimum_subscription_tier__access_level__lte=tier_level
            )

        if ordering:
            queryset = queryset.order_by(ordering)

        if is_featured_param:
            if is_featured_param.lower() == 'true':
                queryset = queryset.filter(is_featured=True)

        return queryset.distinct()
