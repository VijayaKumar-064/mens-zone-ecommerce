import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiSmartphone, FiPackage, FiChevronRight, FiTag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './Checkout.css';

const PAYMENT_METHODS = [
  { id: 'Card', label: 'Credit / Debit Card', icon: <FiCreditCard /> },
  { id: 'UPI', label: 'UPI Payment', icon: <FiSmartphone /> },
  { id: 'COD', label: 'Cash on Delivery', icon: <FiPackage /> },
];

const CheckoutPayment = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');

  const address = JSON.parse(sessionStorage.getItem('mz_address') || '{}');
  const shipping = cartTotal > 999 ? 0 : 99;
  const total = cartTotal - promoDiscount + shipping;

  useEffect(() => {
    document.title = 'Payment – Mens Zone';
    if (!address.name) navigate('/checkout/address');
  }, []);

  const applyPromo = async () => {
    try {
      const { data } = await API.post('/promo/validate', { code: promoCode, orderAmount: cartTotal });
      setPromoDiscount(data.discount);
      setPromoApplied(true);
      toast.success(`Promo applied! You saved ₹${data.discount}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid promo code'); }
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await API.post('/orders', {
        shippingAddress: address,
        paymentMethod,
        promoCode: promoApplied ? promoCode : '',
      });
      sessionStorage.removeItem('mz_address');
      navigate('/checkout/confirmation', { state: { order: data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setPlacing(false);
  };

  return (
    <div className="checkout-page">
      <div className="container checkout-layout">
        <div className="checkout-form-side">
          <div className="checkout-steps">
            <div className="step done"><span>✓</span> Address</div>
            <div className="step active"><span>2</span> Payment</div>
            <div className="step"><span>3</span> Confirm</div>
          </div>

          <div className="checkout-card card">
            <h2><FiCreditCard /> Payment Method</h2>
            <div className="payment-options">
              {PAYMENT_METHODS.map(({ id, label, icon }) => (
                <label key={id} className={`payment-option ${paymentMethod === id ? 'selected' : ''}`}>
                  <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} />
                  <span className="payment-icon">{icon}</span>
                  <span className="payment-label">{label}</span>
                  {id === 'UPI' && <span className="badge badge-green">Recommended</span>}
                </label>
              ))}
            </div>

            {paymentMethod === 'Card' && (
              <div className="payment-fields">
                <div className="form-group"><label className="form-label">Card Number</label>
                  <input className="form-control" placeholder="1234 5678 9012 3456" maxLength={19} value={cardForm.number} onChange={e => setCardForm({ ...cardForm, number: e.target.value })} /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Expiry</label>
                    <input className="form-control" placeholder="MM/YY" value={cardForm.expiry} onChange={e => setCardForm({ ...cardForm, expiry: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">CVV</label>
                    <input className="form-control" placeholder="***" type="password" maxLength={3} value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value })} /></div>
                </div>
              </div>
            )}
            {paymentMethod === 'UPI' && (
              <div className="payment-fields">
                <div className="form-group"><label className="form-label">UPI ID</label>
                  <input className="form-control" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} /></div>
              </div>
            )}
            {paymentMethod === 'COD' && (
              <div className="cod-note"><FiPackage /> Cash on Delivery. Pay when your order arrives. (Additional charges may apply)</div>
            )}
          </div>

          {/* Promo Code */}
          <div className="checkout-card card">
            <h3><FiTag /> Promo Code</h3>
            <div className="promo-input-row">
              <input className="form-control" placeholder="Enter promo code (e.g. WELCOME10)" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} disabled={promoApplied} />
              {promoApplied ? (
                <button className="btn btn-ghost btn-sm" onClick={() => { setPromoApplied(false); setPromoCode(''); setPromoDiscount(0); }}>Remove</button>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={applyPromo} disabled={!promoCode}>Apply</button>
              )}
            </div>
            {promoApplied && <p className="promo-success">✅ ₹{promoDiscount.toFixed(0)} discount applied!</p>}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary card">
          <h3>Order Summary</h3>
          <p className="summary-addr"><strong>Ship to:</strong> {address.name}, {address.city}, {address.state} {address.pincode}</p>
          <div className="divider" />
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          {promoDiscount > 0 && <div className="summary-row discount-row"><span>Promo Discount</span><span>-₹{promoDiscount.toFixed(0)}</span></div>}
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="free-tag">FREE</span> : `₹${shipping}`}</span></div>
          <div className="divider" />
          <div className="summary-row total-row"><span>Total</span><span>₹{total.toFixed(0)}</span></div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '16px' }} onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : `Place Order – ₹${total.toFixed(0)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
