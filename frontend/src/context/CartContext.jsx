// frontend/src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await axios.get('http://127.0.0.1:8000/api/orders/cart/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  // Fetch cart automatically when the provider mounts
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (gameId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/api/orders/cart/',
        { game_id: gameId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
      setIsCartOpen(true); // Automatically slide out the drawer
    } catch (error) {
      alert(error.response?.data?.error || "Error adding to cart");
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/orders/cart/items/${itemId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data);
    } catch (error) {
      console.error("Error removing item", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, isCartOpen, setIsCartOpen, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};