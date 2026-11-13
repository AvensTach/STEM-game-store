from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Category Name")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="URL Slug")

    def __str__(self):
        return self.name


class Developer(models.Model):
    name = models.CharField(max_length=150, unique=True, verbose_name="Developer Name")
    slug = models.SlugField(max_length=150, unique=True, verbose_name="URL Slug")

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Genre Name")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="URL Slug")

    def __str__(self):
        return self.name


class Platform(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Platform Name")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="URL Slug")

    def __str__(self):
        return self.name


class Game(models.Model):
    title = models.CharField(max_length=200, db_index=True, verbose_name="Game Title")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL Slug")

    # 1-to-Many relations
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="games")
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name="games")

    # Many-to-Many relations for robust filtering
    genres = models.ManyToManyField(Genre, related_name="games", blank=True)
    platforms = models.ManyToManyField(Platform, related_name="games", blank=True)

    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Price (USD)")

    minimum_subscription_tier = models.ForeignKey(
        'subscriptions.SubscriptionTier',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="included_games"
    )

    description = models.TextField(verbose_name="Game Description")
    # Store the RAWG image URL directly instead of downloading images to save local space during MVP
    cover_image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Cover Image URL")
    release_date = models.DateField(db_index=True, null=True, blank=True, verbose_name="Release Date")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['category', 'minimum_subscription_tier']),
        ]

    def __str__(self):
        return self.title