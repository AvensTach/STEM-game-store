from django.urls import path
from .views import SubscriptionTierListView, SubscribeView

urlpatterns = [
    path('tiers/', SubscriptionTierListView.as_view(), name='tier-list'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'), # New endpoint
]