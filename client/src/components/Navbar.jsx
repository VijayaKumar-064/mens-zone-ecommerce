import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiHeart, FiSun, FiMoon, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isManager } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (!scrolled && window.scrollY > 20) setScrolled(true); else if (window.scrollY <= 20) setScrolled(false); };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) { navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`); setSearchVal(''); }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">MZ</span>
          <span className="logo-text">Mens Zone</span>
        </Link>

        {/* Desktop Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search products..." />
        </form>

        {/* Nav Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/track" className="nav-link">Track Order</Link>

          {/* Mobile search */}
          <form className="navbar-search-mobile" onSubmit={handleSearch}>
            <FiSearch />
            <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Search..." />
          </form>
        </div>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          <button className="action-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle dark mode">
            {isDark ? <FiSun /> : <FiMoon />}
          </button>

          {user && !isManager && (
            <>
              <Link to="/wishlist" className="action-btn" title="Wishlist"><FiHeart /></Link>
              <Link to="/cart" className="action-btn cart-btn" title="Cart">
                <FiShoppingCart />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </>
          )}

          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="user-avatar">{user.name.charAt(0)}</span>
                <span className="user-name-nav">{user.name.split(' ')[0]}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                    <span className={`badge ${isManager ? 'badge-accent' : 'badge-green'}`}>{user.role}</span>
                  </div>
                  <div className="divider" />
                  {isManager ? (
                    <>
                      <Link to="/admin/dashboard" className="dropdown-item"><FiGrid /> Dashboard</Link>
                      <Link to="/admin/products" className="dropdown-item"><FiPackage /> Products</Link>
                      <Link to="/admin/orders" className="dropdown-item"><FiPackage /> Orders</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" className="dropdown-item"><FiUser /> My Profile</Link>
                      <Link to="/profile/orders" className="dropdown-item"><FiPackage /> My Orders</Link>
                    </>
                  )}
                  <div className="divider" />
                  <button className="dropdown-item dropdown-logout" onClick={logout}><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
