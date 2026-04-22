import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">MZ</span>
              <span>Mens Zone</span>
            </div>
            <p className="footer-desc">
              Premium men's fashion brand offering quality clothing for every occasion. Dress to impress, every day.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=Shirts">Shirts</Link></li>
              <li><Link to="/products?category=T-Shirts">T-Shirts</Link></li>
              <li><Link to="/products?category=Hoodies">Hoodies</Link></li>
              <li><Link to="/products?category=Jackets">Jackets</Link></li>
              <li><Link to="/products?category=Formal Wear">Formal Wear</Link></li>
              <li><Link to="/products?category=Trousers">Trousers</Link></li>
            </ul>
          </div>

          {/* Customer */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer</h4>
            <ul className="footer-links">
              <li><Link to="/profile/orders">My Orders</Link></li>
              <li><Link to="/track">Track Order</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact-list">
              <li><FiMapPin /> 42, Fashion Street, Mumbai, MH 400001</li>
              <li><FiPhone /> +91 98765 43210</li>
              <li><FiMail /> support@menszone.in</li>
            </ul>
            <div className="footer-promo">
              <span className="badge badge-accent">Use WELCOME10</span>
              <p>10% off on first order!</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Mens Zone. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Return Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
