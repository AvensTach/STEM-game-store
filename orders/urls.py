from django.urls import path
from .views import CartDetailView, CartItemDeleteView

urlpatterns = [
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/<int:pk>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
]