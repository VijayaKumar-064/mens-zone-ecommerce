import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const originalPrice = product.discountPrice > 0 ? product.price : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    addToCart(product._id, selectedSize, product.colors?.[0] || '', 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    toggleWishlist(product._id);
  };

  return (
    <div className="product-card card">
      <Link to={`/products/${product._id}`} className="product-card-image-wrap">
        <img src={product.images?.[0] || 'https://placehold.co/400x500/1a1a2e/white?text=Mens+Zone'} alt={product.name} className="product-card-img" loading="lazy" />
        {discount > 0 && <span className="product-discount-badge">-{discount}%</span>}
        {product.isTrending && <span className="product-trending-badge">🔥 Trending</span>}
        <div className="product-card-overlay">
          <button className="overlay-btn" onClick={handleWishlist} aria-label="Wishlist">
            <FiHeart className={isInWishlist(product._id) ? 'heart-filled' : ''} />
          </button>
          <Link to={`/products/${product._id}`} className="overlay-btn" aria-label="Quick view">
            <FiEye />
          </Link>
        </div>
      </Link>

      <div className="product-card-body">
        <Link to={`/products/${product._id}`}>
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-rating">
          <FiStar className="star-icon" />
          <span>{product.ratings > 0 ? product.ratings.toFixed(1) : 'New'}</span>
          <span className="review-count">({product.numReviews})</span>
        </div>

        <div className="product-sizes">
          {product.sizes?.slice(0, 5).map((s) => (
            <button key={s} className={`size-chip ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="product-card-footer">
          <div className="product-price">
            <span className="price-current">₹{price.toLocaleString()}</span>
            {originalPrice && <span className="price-original">₹{originalPrice.toLocaleString()}</span>}
          </div>
          <button className="btn btn-primary btn-sm add-cart-btn" onClick={handleAddToCart}>
            <FiShoppingCart /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
