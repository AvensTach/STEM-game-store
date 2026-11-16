from django.urls import path
from .views import CartDetailView, CartItemDeleteView, CheckoutView

urlpatterns = [
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/<int:pk>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
]
