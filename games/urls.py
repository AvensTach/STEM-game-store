from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, DeveloperViewSet, GameViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'developers', DeveloperViewSet)
router.register(r'games', GameViewSet)

urlpatterns = [
    path('', include(router.urls)),
]