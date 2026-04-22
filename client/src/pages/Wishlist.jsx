import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const products = wishlist.products || [];

  useEffect(() => { document.title = 'Wishlist – Mens Zone'; }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>My Wishlist</h1>
          <p>{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>
      <div className="container" style={{ padding: '40px 20px' }}>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FiHeart /></div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love for later!</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Products</Link>
          </div>
        ) : (
          <div className="grid-4">
            {products.map((p) => p && <ProductCard key={p._id || p} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
