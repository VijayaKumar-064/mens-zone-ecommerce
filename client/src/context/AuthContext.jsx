import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mz_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('mz_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('mz_token', data.token);
      localStorage.setItem('mz_user', JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    } finally { setLoading(false); }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password, phone });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('mz_token', data.token);
      localStorage.setItem('mz_user', JSON.stringify(data.user));
      toast.success(`Welcome to Mens Zone, ${data.user.name}!`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mz_token');
    localStorage.removeItem('mz_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await API.put('/auth/profile', profileData);
      setUser(data.user);
      localStorage.setItem('mz_user', JSON.stringify(data.user));
      toast.success('Profile updated!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      throw err;
    }
  };

  const isManager = user?.role === 'manager';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, isManager, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
