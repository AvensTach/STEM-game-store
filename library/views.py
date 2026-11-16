# library/views.py
from rest_framework import views, status, permissions
from rest_framework.response import Response
from orders.models import Purchase
from games.models import Game
from games.serializers import GameSerializer


class LibraryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # 1. Get all IDs of games the user explicitly bought
        purchased_game_ids = set(Purchase.objects.filter(user=request.user).values_list('game_id', flat=True))

        # 2. Check user's active subscription tier level
        user_tier_level = 0
        if hasattr(request.user, 'subscription') and request.user.subscription.is_active:
            user_tier_level = request.user.subscription.tier.access_level

        # 3. Evaluate all games to find accessible ones
        all_games = Game.objects.all().prefetch_related(
            'genres', 'platforms'
        ).select_related(
            'developer', 'minimum_subscription_tier'
        )

        library_data = []
        for game in all_games:
            is_bought = game.id in purchased_game_ids
            is_sub = game.minimum_subscription_tier and game.minimum_subscription_tier.access_level <= user_tier_level

            if is_bought or is_sub:
                game_data = GameSerializer(game).data
                # Add a custom flag so React knows how the user owns it
                game_data['access_source'] = 'bought' if is_bought else 'subscription'
                library_data.append(game_data)

        return Response(library_data, status=status.HTTP_200_OK)