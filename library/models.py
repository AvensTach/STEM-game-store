from django.db import models
from django.contrib.auth.models import User
from games.models import Game

class UserGame(models.Model):
    # Tracks games permanently purchased by the user
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_games")
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="owners")
    acquired_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'game')
        indexes = [
            models.Index(fields=['user', 'game']),
        ]

    def __str__(self):
        return f"{self.user.username} owns {self.game.title}"