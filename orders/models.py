from django.db import models
from django.contrib.auth.models import User
from games.models import Game

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent the exact same game from being added to the cart multiple times
        unique_together = ('cart', 'game')
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.game.title} in {self.cart.user.username}'s cart"

class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)
    price_paid = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ('user', 'game') # Prevent buying the same game twice

    def __str__(self):
        return f"{self.user.username} bought {self.game.title}"