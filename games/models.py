from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Category Name")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="URL Slug")
    description = models.TextField(blank=True, verbose_name="Description")

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Game(models.Model):
    title = models.CharField(max_length=200, verbose_name="Game Title")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL Slug")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="games", verbose_name="Category")
    developer = models.CharField(max_length=150, verbose_name="Developer")

    # Using DecimalField for precise financial calculations
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Price (USD)")

    # Indicates if the game is part of a subscription or standalone purchase only
    available_in_subscription = models.BooleanField(default=False, verbose_name="Available in Subscription")

    description = models.TextField(verbose_name="Game Description")

    # Requires the Pillow library for image processing
    cover_image = models.ImageField(upload_to='games/covers/', blank=True, null=True, verbose_name="Cover Image")

    release_date = models.DateField(verbose_name="Release Date")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Game"
        verbose_name_plural = "Games"

    def __str__(self):
        return self.title


class SubscriptionPlan(models.Model):
    DURATION_CHOICES = (
        (30, '1 Month'),
        (90, '3 Months'),
        (365, '1 Year'),
    )

    name = models.CharField(max_length=100, verbose_name="Plan Name (e.g., 'Premium')")
    price = models.DecimalField(max_digits=6, decimal_places=2, verbose_name="Plan Price")
    duration_days = models.IntegerField(choices=DURATION_CHOICES, default=30, verbose_name="Duration (in days)")
    description = models.TextField(blank=True, verbose_name="Description of Benefits")
    is_active = models.BooleanField(default=True, verbose_name="Is Active")

    class Meta:
        verbose_name = "Subscription Plan"
        verbose_name_plural = "Subscription Plans"

    def __str__(self):
        return f"{self.name} - ${self.price}"