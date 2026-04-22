import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Shirts', icon: '👔', color: '#4f46e5' },
  { name: 'T-Shirts', icon: '👕', color: '#e94560' },
  { name: 'Hoodies', icon: '🧥', color: '#7c3aed' },
  { name: 'Jackets', icon: '🧤', color: '#059669' },
  { name: 'Formal Wear', icon: '🤵', color: '#1a1a2e' },
  { name: 'Track Pants', icon: '🩱', color: '#dc6f42' },
  { name: 'Cotton Pants', icon: '👖', color: '#b45309' },
  { name: 'Trousers', icon: '👔', color: '#0f766e' },
  { name: 'Innerwear', icon: '🩲', color: '#7e22ce' },
];

const TESTIMONIALS = [
  { name: 'Arjun Mehta', role: 'Software Engineer', rating: 5, text: 'Absolutely love the quality! The Oxford shirt I ordered fits perfectly and looks incredibly sharp at work.', avatar: 'A' },
  { name: 'Karthik Reddy', role: 'Fitness Trainer', rating: 5, text: 'The DryFit joggers are top-notch. Light, breathable, and great for intense workouts. Will buy more!', avatar: 'K' },
  { name: 'Rahul Sharma', role: 'Business Owner', rating: 4, text: "Mens Zone delivers on its promise — premium quality at reasonable prices. Fast delivery too!", avatar: 'R' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Mens Zone – Premium Men\'s Fashion';
    const fetchProducts = async () => {
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          API.get('/products?featured=true&limit=4'),
          API.get('/products?trending=true&limit=4'),
        ]);
        setFeatured(featuredRes.data.products);
        setTrending(trendingRes.data.products);
      } catch {}
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text animate-fade-in-up">
            <span className="hero-tag badge badge-accent">New Collection 2024</span>
            <h1 className="hero-title">
              Dress Like<br />
              <span className="hero-accent">Every Day</span><br />
              Is Yours
            </h1>
            <p className="hero-desc">
              Premium menswear crafted for modern men. From boardrooms to weekends — find your perfect style at Mens Zone.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
                <FiShoppingBag /> Shop Now
              </button>
              <Link to="/products?category=Formal Wear" className="btn btn-ghost btn-lg">
                Explore Collections <FiArrowRight />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><span>10k+</span><p>Happy Customers</p></div>
              <div className="hero-stat"><span>500+</span><p>Styles Available</p></div>
              <div className="hero-stat"><span>4.8⭐</span><p>Average Rating</p></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" alt="Men's Fashion" />
              <div className="hero-card-badge">
                <FiStar /> 4.9 Rated Brand
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: <FiRefreshCw />, title: '7-Day Returns', desc: 'Hassle-free replacement' },
              { icon: <FiShield />, title: 'Secure Payment', desc: 'UPI, Card & COD' },
              { icon: <FiStar />, title: 'Premium Quality', desc: '100% authentic products' },
            ].map((t) => (
              <div key={t.title} className="trust-item">
                <div className="trust-icon">{t.icon}</div>
                <div><h4>{t.title}</h4><p>{t.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title text-center">Shop by Category</h2>
          <p className="section-subtitle text-center">Explore our wide range of men's fashion categories</p>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`} className="category-card" style={{ '--cat-color': cat.color }}>
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked premium styles just for you</p>
            </div>
            <Link to="/products?featured=true" className="btn btn-outline">View All <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="grid-4">{featured.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <div>
              <h2>Get 10% Off Your First Order!</h2>
              <p>Use code <strong>WELCOME10</strong> at checkout. Limited time offer.</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>Shop and Save</button>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="section trending-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Trending Now</h2>
              <p className="section-subtitle">What everyone's buying this season</p>
            </div>
            <Link to="/products?trending=true" className="btn btn-outline">See All <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="grid-4">{trending.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <h2 className="section-title text-center">What Our Customers Say</h2>
          <p className="section-subtitle text-center">Real reviews from verified buyers</p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => <FiStar key={i} className="star-filled" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
