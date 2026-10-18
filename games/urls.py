from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, GameViewSet, SubscriptionPlanViewSet

# DefaultRouter automatically generates URLs for our ViewSets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'games', GameViewSet)
router.register(r'subscriptions', SubscriptionPlanViewSet)

urlpatterns = [
    path('', include(router.urls)),
]