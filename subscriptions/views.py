from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from .models import SubscriptionTier, UserSubscription
from .serializers import SubscriptionTierSerializer, UserSubscriptionSerializer


class SubscriptionTierListView(generics.ListAPIView):
    # Returns only active tiers, ordered from Basic to Premium
    queryset = SubscriptionTier.objects.filter(is_active=True).order_by('access_level')
    serializer_class = SubscriptionTierSerializer
    permission_classes = [permissions.AllowAny]


# subscriptions/views.py
from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from .models import SubscriptionTier, UserSubscription

class SubscribeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        tier_id = request.data.get('tier_id')
        duration_months = request.data.get('duration_months', 1)

        try:
            tier = SubscriptionTier.objects.get(id=tier_id)
        except SubscriptionTier.DoesNotExist:
            return Response({"error": "Tier not found"}, status=status.HTTP_404_NOT_FOUND)

        # Calculate expiration date based on duration
        expires_at = timezone.now() + relativedelta(months=int(duration_months))

        # Update or create the user's active subscription
        UserSubscription.objects.update_or_create(
            user=request.user,
            defaults={
                'tier': tier,
                'is_active': True,
                'expires_at': expires_at
            }
        )

        return Response({"message": f"Successfully subscribed to {tier.name} for {duration_months} months!"}, status=status.HTTP_200_OK)