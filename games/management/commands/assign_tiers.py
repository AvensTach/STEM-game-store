# games/management/commands/assign_tiers.py
import random
from django.core.management.base import BaseCommand
from games.models import Game
from subscriptions.models import SubscriptionTier


class Command(BaseCommand):
    help = 'Randomly assigns 50 games to available subscription tiers'

    def handle(self, *args, **kwargs):
        # Fetch all available subscription tiers
        tiers = list(SubscriptionTier.objects.all())

        if not tiers:
            self.stdout.write(
                self.style.ERROR("No subscription tiers found in the database. Please create them first."))
            return

        # Fetch 50 random games (order_by('?') randomizes the queryset)
        games = Game.objects.order_by('?')[:50]

        if not games:
            self.stdout.write(self.style.ERROR("No games found in the database."))
            return

        updated_count = 0
        self.stdout.write("Starting random tier assignment...")

        for game in games:
            # Pick a random tier
            random_tier = random.choice(tiers)

            # Assign and save
            game.minimum_subscription_tier = random_tier
            game.save()
            updated_count += 1

            self.stdout.write(f"Assigned '{game.title}' to {random_tier.name}")

        self.stdout.write(
            self.style.SUCCESS(f"Successfully assigned {updated_count} games to random subscription tiers."))