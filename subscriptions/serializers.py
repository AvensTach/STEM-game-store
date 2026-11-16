from rest_framework import serializers
from .models import SubscriptionTier, UserSubscription

class SubscriptionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionTier
        fields = ['id', 'name', 'access_level', 'price', 'description']

class UserSubscriptionSerializer(serializers.ModelSerializer):
    # Nest the tier so the frontend knows the name and access level of the active plan
    tier = SubscriptionTierSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = ['id', 'tier', 'start_date', 'end_date', 'is_active']