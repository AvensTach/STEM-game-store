import os
import requests
import random
from decimal import Decimal
from datetime import datetime
from django.core.management.base import BaseCommand
from games.models import Game, Category, Developer, Genre, Platform
import environ


class Command(BaseCommand):
    help = 'Imports 100 games from the RAWG API with smart pricing'

    def generate_smart_price(self, rating, ratings_count):
        # Logic to assign realistic industry-standard pricing based on game reception and popularity
        if rating >= 4.5 and ratings_count > 2000:
            # High rating and massive popularity usually indicate a premium AAA title
            price = random.choice([49.99, 59.99, 69.99])
        elif rating >= 4.0 and ratings_count > 500:
            # Solid hits and popular mid-tier games
            price = random.choice([29.99, 39.99, 49.99])
        elif rating >= 3.0:
            # Average games or older titles
            price = random.choice([14.99, 19.99, 24.99])
        else:
            # Niche, poorly rated, or very small indie games
            price = random.choice([4.99, 9.99])

        return Decimal(str(price))

    def handle(self, *args, **kwargs):
        # Initialize environ to read the API key from .env
        env = environ.Env()
        api_key = env('RAWG_API_KEY', default=None)

        if not api_key:
            self.stdout.write(self.style.ERROR('RAWG_API_KEY not found in environment variables.'))
            return

        # Start with the first page
        url = f'https://api.rawg.io/api/games?key={api_key}&page_size=40&ordering=-added'

        TARGET_IMPORT_COUNT = 100
        games_imported = 0

        # Create default category and developer for API records that lack them
        default_category, _ = Category.objects.get_or_create(name="General", slug="general")
        default_developer, _ = Developer.objects.get_or_create(name="Unknown Developer", slug="unknown-developer")

        self.stdout.write('Starting import process for 100 games...')

        # Loop through paginated API responses until we hit our target
        while url and games_imported < TARGET_IMPORT_COUNT:
            self.stdout.write(f'Fetching data from: {url}')
            response = requests.get(url)

            if response.status_code != 200:
                self.stdout.write(self.style.ERROR(f'Failed to fetch data: HTTP {response.status_code}'))
                break

            data = response.json()

            for item in data.get('results', []):
                # Stop processing if we have reached exactly 100 games
                if games_imported >= TARGET_IMPORT_COUNT:
                    break

                title = item.get('name')
                slug = item.get('slug')
                released_str = item.get('released')
                cover_image_url = item.get('background_image')
                rating = item.get('rating', 0)
                ratings_count = item.get('ratings_count', 0)

                # Format the release date safely
                release_date = None
                if released_str:
                    try:
                        release_date = datetime.strptime(released_str, '%Y-%m-%d').date()
                    except ValueError:
                        pass

                # Calculate smart price based on RAWG metrics
                smart_price = self.generate_smart_price(rating, ratings_count)

                # Create or get the main Game object
                game, created = Game.objects.get_or_create(
                    slug=slug,
                    defaults={
                        'title': title,
                        'category': default_category,
                        'developer': default_developer,
                        'price': smart_price,
                        'description': f"Experience the incredible world of {title}. Rating: {rating}/5 based on {ratings_count} reviews.",
                        'cover_image_url': cover_image_url,
                        'release_date': release_date
                    }
                )

                if created:
                    # Process and attach Genres (Many-to-Many)
                    for g_data in item.get('genres', []):
                        genre, _ = Genre.objects.get_or_create(
                            slug=g_data.get('slug'),
                            defaults={'name': g_data.get('name')}
                        )
                        game.genres.add(genre)

                    # Process and attach Platforms (Many-to-Many)
                    for p_wrapper in item.get('platforms', []):
                        p_data = p_wrapper.get('platform', {})
                        platform, _ = Platform.objects.get_or_create(
                            slug=p_data.get('slug'),
                            defaults={'name': p_data.get('name')}
                        )
                        game.platforms.add(platform)

                    games_imported += 1
                    self.stdout.write(self.style.SUCCESS(
                        f'[{games_imported}/{TARGET_IMPORT_COUNT}] Imported: {title} (${smart_price})'))
                else:
                    self.stdout.write(self.style.WARNING(f'Game already exists, skipping: {title}'))

            # Retrieve the URL for the next page of results
            url = data.get('next')

        self.stdout.write(
            self.style.SUCCESS(f'Import complete. Successfully added {games_imported} games to the database.'))