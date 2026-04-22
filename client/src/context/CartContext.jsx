import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user || user.role !== 'customer') return;
    try {
      const { data } = await API.get('/cart');
      setCart(data.cart);
    } catch {}
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    try {
      const { data } = await API.post('/cart/add', { productId, size, color, quantity });
      setCart(data.cart);
      toast.success('Added to cart!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add'); }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await API.put(`/cart/${itemId}`, { quantity });
      setCart(data.cart);
    } catch (err) { toast.error('Update failed'); }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await API.delete(`/cart/${itemId}`);
      setCart(data.cart);
      toast.success('Item removed');
    } catch (err) { toast.error('Remove failed'); }
  };

  const clearCart = async () => {
    try {
      await API.delete('/cart');
      setCart({ items: [] });
    } catch {}
  };

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((sum, i) => {
    const price = i.product?.discountPrice > 0 ? i.product.discountPrice : i.product?.price || 0;
    return sum + price * i.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
