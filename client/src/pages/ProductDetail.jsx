import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiCheck, FiTruck, FiRefreshCw } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
        setReviews(data.reviews);
        setSelectedSize(data.product.sizes?.[0] || '');
        setSelectedColor(data.product.colors?.[0] || '');
        document.title = `${data.product.name} – Mens Zone`;
      } catch { navigate('/products'); }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product._id, selectedSize, selectedColor, qty);
  };

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(product._id, selectedSize, selectedColor, qty);
    navigate('/checkout/address');
  };

  const handleWishlist = () => {
    if (!user) { navigate('/login'); return; }
    toggleWishlist(product._id);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const { data } = await API.post(`/reviews/${product._id}`, reviewForm);
      setReviews([data.review, ...reviews]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
      const refreshed = await API.get(`/products/${id}`);
      setProduct(refreshed.data.product);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    setSubmitting(false);
  };

  if (loading) return <div className="spinner-wrap" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  if (!product) return null;

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> /
          <span onClick={() => navigate('/products')}>Products</span> /
          <span>{product.category}</span> / <span className="active">{product.name}</span>
        </div>

        {/* Product Main */}
        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images">
            <div className="main-image-wrap">
              <img src={product.images?.[activeImg] || 'https://placehold.co/600x700/1a1a2e/white?text=Mens+Zone'} alt={product.name} className="main-image" />
              {discount > 0 && <span className="product-discount-badge">-{discount}%</span>}
            </div>
            <div className="thumbnail-strip">
              {product.images?.map((img, i) => (
                <img key={i} src={img} alt={`View ${i + 1}`}
                  className={`thumbnail ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)} />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            <span className="product-category-label">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-rating-row">
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <FiStar key={s} className={s <= Math.round(product.ratings) ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <span>{product.ratings > 0 ? product.ratings.toFixed(1) : 'New'}</span>
              <span className="review-count">({product.numReviews} reviews)</span>
            </div>

            <div className="product-price-row">
              <span className="price-big">₹{price.toLocaleString()}</span>
              {product.discountPrice > 0 && <>
                <span className="price-original-big">₹{product.price.toLocaleString()}</span>
                <span className="discount-pct">Save {discount}%</span>
              </>}
            </div>

            <p className="product-desc">{product.description}</p>

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="option-group">
                <label>Color: <strong>{selectedColor}</strong></label>
                <div className="color-chips">
                  {product.colors.map((c) => (
                    <button key={c} className={`color-chip ${selectedColor === c ? 'active' : ''}`} onClick={() => setSelectedColor(c)}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="option-group">
                <label>Size: <strong>{selectedSize}</strong></label>
                <div className="size-chips">
                  {product.sizes.map((s) => (
                    <button key={s} className={`size-chip ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="option-group">
              <label>Quantity</label>
              <div className="qty-control">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>–</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button className="btn btn-dark btn-lg" onClick={handleAddToCart}><FiShoppingCart /> Add to Cart</button>
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow}>Buy Now</button>
              <button className={`wishlist-btn ${isInWishlist(product._id) ? 'wished' : ''}`} onClick={handleWishlist} aria-label="Wishlist">
                <FiHeart />
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              {[
                { icon: <FiTruck />, text: 'Free delivery on orders above ₹999' },
                { icon: <FiRefreshCw />, text: '7-day easy replacement' },
                { icon: <FiCheck />, text: '100% authentic product' },
              ].map((f, i) => (
                <div key={i} className="feature-item"><span className="feature-icon">{f.icon}</span><span>{f.text}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="section-title">Ratings & Reviews</h2>

          {/* Write Review */}
          {user?.role === 'customer' && (
            <form className="write-review card" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>
              <div className="star-picker">
                {[1,2,3,4,5].map(s => (
                  <button type="button" key={s} onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                    <FiStar className={s <= reviewForm.rating ? 'star-filled' : 'star-empty'} />
                  </button>
                ))}
              </div>
              <div className="form-group">
                <input className="form-control" placeholder="Review title" value={reviewForm.title} onChange={(e) => setReviewForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <textarea className="form-control" rows="3" placeholder="Share your experience..." required value={reviewForm.comment} onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
            </form>
          )}

          {/* Review List */}
          {reviews.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">⭐</div><h3>No reviews yet</h3><p>Be the first to review this product</p></div>
          ) : (
            <div className="reviews-list">
              {reviews.map((r) => (
                <div key={r._id} className="review-item card">
                  <div className="review-header">
                    <div className="review-avatar">{r.user?.name?.charAt(0)}</div>
                    <div>
                      <p className="review-name">{r.user?.name || r.name}</p>
                      <div className="stars">
                        {[1,2,3,4,5].map(s => <FiStar key={s} className={s <= r.rating ? 'star-filled' : 'star-empty'} />)}
                      </div>
                    </div>
                    {r.isVerifiedPurchase && <span className="badge badge-green verified-badge"><FiCheck /> Verified</span>}
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.title && <h4 className="review-title">{r.title}</h4>}
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
