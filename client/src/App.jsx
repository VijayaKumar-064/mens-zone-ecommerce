import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const CheckoutAddress = lazy(() => import('./pages/Checkout/Address'));
const CheckoutPayment = lazy(() => import('./pages/Checkout/Payment'));
const CheckoutConfirmation = lazy(() => import('./pages/Checkout/Confirmation'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminApprovals = lazy(() => import('./pages/admin/Approvals'));

const Spinner = () => (
  <div className="spinner-wrap" style={{ minHeight: '60vh' }}>
    <div className="spinner" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: { borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
                  duration: 3000,
                }}
              />
              <div className="page-wrapper">
                <Suspense fallback={<Spinner />}>
                  <Routes>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/track" element={<OrderTracking />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Customer Protected */}
                    <Route path="/cart" element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>} />
                    <Route path="/checkout/address" element={<ProtectedRoute role="customer"><CheckoutAddress /></ProtectedRoute>} />
                    <Route path="/checkout/payment" element={<ProtectedRoute role="customer"><CheckoutPayment /></ProtectedRoute>} />
                    <Route path="/checkout/confirmation" element={<ProtectedRoute role="customer"><CheckoutConfirmation /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute role="customer"><Profile /></ProtectedRoute>} />
                    <Route path="/profile/orders" element={<ProtectedRoute role="customer"><Profile tab="orders" /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute role="customer"><Wishlist /></ProtectedRoute>} />

                    {/* Manager Protected */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute role="manager"><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute role="manager"><AdminProducts /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute role="manager"><AdminOrders /></ProtectedRoute>} />
                    <Route path="/admin/approvals" element={<ProtectedRoute role="manager"><AdminApprovals /></ProtectedRoute>} />

                    {/* 404 */}
                    <Route path="*" element={
                      <div className="empty-state" style={{ paddingTop: '120px' }}>
                        <div className="empty-state-icon">🔍</div>
                        <h3>Page Not Found</h3>
                        <p>The page you're looking for doesn't exist.</p>
                        <a href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Go Home</a>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
