from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Purchase
from .serializers import CartSerializer, CartItemSerializer


class CartDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get or create ensures a user always has a cart, even if they just registered
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)

        if serializer.is_valid():
            game = serializer.validated_data['game']

            # Prevent adding duplicate games to the cart
            if CartItem.objects.filter(cart=cart, game=game).exists():
                return Response(
                    {"error": "This game is already in your cart."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save(cart=cart)
            # Return the updated cart so React can refresh the total price instantly
            return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CartItemDeleteView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        cart = get_object_or_404(Cart, user=request.user)
        item = get_object_or_404(CartItem, pk=pk, cart=cart)
        item.delete()

        # Return the updated cart after deletion
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CheckoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        items = cart.items.all()

        if not items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a Purchase record for every game in the cart
        for item in items:
            Purchase.objects.get_or_create(
                user=request.user,
                game=item.game,
                defaults={'price_paid': item.game.price}
            )

        # Empty the cart after successful checkout
        items.delete()

        return Response({"message": "Games successfully purchased!"}, status=status.HTTP_200_OK)