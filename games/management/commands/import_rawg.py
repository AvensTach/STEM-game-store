import os
import requests
import random
import time
from decimal import Decimal
from datetime import datetime
from django.core.management.base import BaseCommand
from games.models import Game, Category, Developer, Genre, Platform
import environ


class Command(BaseCommand):
    help = 'Imports 100 games from the RAWG API with real descriptions and developers'

    def generate_smart_price(self, rating, ratings_count):
        if rating >= 4.5 and ratings_count > 2000:
            price = random.choice([49.99, 59.99, 69.99])
        elif rating >= 4.0 and ratings_count > 500:
            price = random.choice([29.99, 39.99, 49.99])
        elif rating >= 3.0:
            price = random.choice([14.99, 19.99, 24.99])
        else:
            price = random.choice([4.99, 9.99])
        return Decimal(str(price))

    def handle(self, *args, **kwargs):
        env = environ.Env()
        api_key = env('RAWG_API_KEY', default=None)

        if not api_key:
            self.stdout.write(self.style.ERROR('RAWG_API_KEY not found in environment variables.'))
            return

        url = f'https://api.rawg.io/api/games?key={api_key}&page_size=40&ordering=-added'
        TARGET_IMPORT_COUNT = 100
        games_imported = 0

        default_category, _ = Category.objects.get_or_create(name="General", slug="general")
        default_developer, _ = Developer.objects.get_or_create(name="Unknown Developer", slug="unknown-developer")

        self.stdout.write(
            'Starting import process. This will take a moment as it fetches detailed data for each game...')

        while url and games_imported < TARGET_IMPORT_COUNT:
            response = requests.get(url)
            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f'Failed to fetch data: HTTP {response.status_code}'))
                break

            data = response.json()

            for item in data.get('results', []):
                if games_imported >= TARGET_IMPORT_COUNT:
                    break

                title = item.get('name')
                slug = item.get('slug')
                released_str = item.get('released')
                cover_image_url = item.get('background_image')
                rating = item.get('rating', 0)
                ratings_count = item.get('ratings_count', 0)

                release_date = None
                if released_str:
                    try:
                        release_date = datetime.strptime(released_str, '%Y-%m-%d').date()
                    except ValueError:
                        pass

                # --- NEW: Fetch specific game details for Description and Developer ---
                detail_url = f'https://api.rawg.io/api/games/{slug}?key={api_key}'
                detail_response = requests.get(detail_url)

                if detail_response.status_code == 200:
                    detail_data = detail_response.json()

                    # Get raw text description
                    description = detail_data.get('description_raw') or detail_data.get(
                        'description') or f"Experience {title}."

                    # Extract the first developer from the array
                    devs = detail_data.get('developers', [])
                    if devs:
                        dev_data = devs[0]
                        developer, _ = Developer.objects.get_or_create(
                            slug=dev_data.get('slug'),
                            defaults={'name': dev_data.get('name')}
                        )
                    else:
                        developer = default_developer
                else:
                    description = f"Experience {title}."
                    developer = default_developer

                # Be polite to the RAWG API to avoid rate limiting
                time.sleep(0.2)
                # ---------------------------------------------------------------------

                smart_price = self.generate_smart_price(rating, ratings_count)

                game, created = Game.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'title': title,
                        'category': default_category,
                        'developer': developer,  # Now uses the real developer
                        'price': smart_price,
                        'description': description,  # Now uses the real description
                        'cover_image_url': cover_image_url,
                        'release_date': release_date
                    }
                )

                if created:
                    for g_data in item.get('genres', []):
                        genre, _ = Genre.objects.get_or_create(
                            slug=g_data.get('slug'),
                            defaults={'name': g_data.get('name')}
                        )
                        game.genres.add(genre)

                    for p_wrapper in item.get('platforms', []):
                        p_data = p_wrapper.get('platform', {})
                        platform, _ = Platform.objects.get_or_create(
                            slug=p_data.get('slug'),
                            defaults={'name': p_data.get('name')}
                        )
                        game.platforms.add(platform)

                    games_imported += 1
                    self.stdout.write(self.style.SUCCESS(
                        f'[{games_imported}/{TARGET_IMPORT_COUNT}] Imported: {title} by {developer.name}'))
                else:
                    # Update existing games with the new rich description and developer data
                    game.description = description
                    game.developer = developer
                    game.save()
                    self.stdout.write(self.style.WARNING(f'Updated existing game: {title}'))

            url = data.get('next')

        self.stdout.write(self.style.SUCCESS(f'Import complete. Successfully added/updated {games_imported} games.'))