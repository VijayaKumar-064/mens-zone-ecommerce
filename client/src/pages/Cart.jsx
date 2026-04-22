import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();
  const shipping = cartTotal > 999 ? 0 : cartTotal > 0 ? 99 : 0;
  const total = cartTotal + shipping;

  useEffect(() => { document.title = 'Cart – Mens Zone'; }, []);

  if (!cart.items?.length) {
    return (
      <div className="empty-state" style={{ paddingTop: '80px' }}>
        <div className="empty-state-icon"><FiShoppingBag /></div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet!</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="container">
          <h1>Shopping Cart</h1>
          <p>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.items.map((item) => {
            const p = item.product;
            if (!p) return null;
            const price = p.discountPrice > 0 ? p.discountPrice : p.price;
            return (
              <div key={item._id} className="cart-item card">
                <Link to={`/products/${p._id}`}>
                  <img src={p.images?.[0] || 'https://placehold.co/100x130/1a1a2e/white?text=MZ'} alt={p.name} className="cart-item-img" />
                </Link>
                <div className="cart-item-info">
                  <p className="cart-item-cat">{p.category}</p>
                  <h3 className="cart-item-name"><Link to={`/products/${p._id}`}>{p.name}</Link></h3>
                  <div className="cart-item-meta">
                    {item.size && <span className="meta-chip">Size: {item.size}</span>}
                    {item.color && <span className="meta-chip">Color: {item.color}</span>}
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)}><FiMinus /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><FiPlus /></button>
                    </div>
                    <span className="cart-item-price">₹{(price * item.quantity).toLocaleString()}</span>
                    <button className="remove-btn" onClick={() => removeItem(item._id)}><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-tag">FREE</span> : `₹${shipping}`}</span></div>
          {shipping > 0 && <p className="shipping-note">Add ₹{(999 - cartTotal).toLocaleString()} more for free shipping</p>}
          <div className="divider" />
          <div className="summary-row total-row"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }} onClick={() => navigate('/checkout/address')}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-ghost" style={{ width: '100%', marginTop: '10px', textAlign: 'center' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
