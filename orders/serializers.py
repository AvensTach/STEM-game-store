from rest_framework import serializers
from .models import Cart, CartItem
from games.models import Game

class CartGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'title', 'price', 'cover_image_url']

class CartItemSerializer(serializers.ModelSerializer):
    # For reading: return the nested game object
    game = CartGameSerializer(read_only=True)
    # For writing: accept a game ID
    game_id = serializers.PrimaryKeyRelatedField(
        queryset=Game.objects.all(), source='game', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'game', 'game_id', 'added_at']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'updated_at']

    def get_total_price(self, obj):
        # Calculate the total sum of all games in the cart
        return sum(item.game.price for item in obj.items.all())