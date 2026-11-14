from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, DeveloperViewSet, GameViewSet, GenreViewSet, PlatformViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'developers', DeveloperViewSet)
router.register(r'genres', GenreViewSet)
router.register(r'platforms', PlatformViewSet)
router.register(r'games', GameViewSet, basename='game')

urlpatterns = [
    path('', include(router.urls)),
]