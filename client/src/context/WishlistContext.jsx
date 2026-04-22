import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });

  const fetchWishlist = async () => {
    if (!user || user.role !== 'customer') return;
    try {
      const { data } = await API.get('/wishlist');
      setWishlist(data.wishlist);
    } catch {}
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const toggleWishlist = async (productId) => {
    try {
      const { data } = await API.post(`/wishlist/toggle/${productId}`);
      setWishlist(data.wishlist);
      toast.success(data.added ? 'Added to wishlist ❤️' : 'Removed from wishlist');
      return data.added;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Please login first');
    }
  };

  const isInWishlist = (productId) =>
    wishlist.products?.some((p) => (p._id || p) === productId) || false;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
