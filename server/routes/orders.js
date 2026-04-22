const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const PromoCode = require('../models/PromoCode');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route POST /api/orders – Create order
router.post('/', protect, authorize('customer'), async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, promoCode } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' });

    let itemsPrice = 0;
    const orderItems = cart.items.map((item) => {
      const p = item.product;
      const price = p.discountPrice > 0 ? p.discountPrice : p.price;
      itemsPrice += price * item.quantity;
      return { product: p._id, name: p.name, image: p.images[0], price, quantity: item.quantity, size: item.size, color: item.color };
    });

    let discount = 0;
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase(), isActive: true });
      if (promo && (!promo.expiresAt || promo.expiresAt > new Date()) && promo.usedCount < promo.maxUses && itemsPrice >= promo.minOrderAmount) {
        discount = promo.discountType === 'percentage' ? (itemsPrice * promo.discountValue) / 100 : promo.discountValue;
        await PromoCode.findByIdAndUpdate(promo._id, { $inc: { usedCount: 1 } });
      }
    }

    const shippingPrice = itemsPrice > 999 ? 0 : 99;
    const totalPrice = itemsPrice - discount + shippingPrice;

    const order = await Order.create({
      user: req.user._id, items: orderItems, shippingAddress, paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      itemsPrice, shippingPrice, discount, totalPrice,
      promoCode: promoCode || '',
      statusHistory: [{ status: 'Processing', note: 'Order placed successfully' }],
    });

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
});

// @route GET /api/orders – Customer: my orders | Manager: all orders
router.get('/', protect, async (req, res, next) => {
  try {
    const query = req.user.role === 'manager' ? {} : { user: req.user._id };
    const { status, page = 1, limit = 10 } = req.query;
    if (status) query.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).populate('user', 'name email').sort('-createdAt').skip(skip).limit(Number(limit));
    res.json({ success: true, total, orders });
  } catch (err) { next(err); }
});

// @route GET /api/orders/track/:orderId – Public order tracking
router.get('/track/:orderId', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// @route GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images category');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (req.user.role !== 'manager' && order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// @route PUT /api/orders/:id/status – Manager updates status
router.put('/:id/status', protect, authorize('manager'), async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    if (status === 'Delivered') order.deliveredAt = new Date();
    order.statusHistory.push({ status, note: note || '' });
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// @route POST /api/orders/:id/cancel – Customer requests cancellation
router.post('/:id/cancel', protect, authorize('customer'), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (order.status !== 'Processing')
      return res.status(400).json({ success: false, message: 'Cancellation only allowed before shipping' });
    order.cancellationRequest = { requested: true, reason: req.body.reason, status: 'Pending', requestedAt: new Date() };
    await order.save();
    res.json({ success: true, message: 'Cancellation request submitted', order });
  } catch (err) { next(err); }
});

// @route POST /api/orders/:id/replace – Customer requests replacement
router.post('/:id/replace', protect, authorize('customer'), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (order.status !== 'Delivered')
      return res.status(400).json({ success: false, message: 'Replacement only available after delivery' });
    const daysSinceDelivery = (new Date() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 7)
      return res.status(400).json({ success: false, message: 'Replacement window (7 days) has expired' });
    order.replacementRequest = { requested: true, reason: req.body.reason, status: 'Pending', requestedAt: new Date() };
    await order.save();
    res.json({ success: true, message: 'Replacement request submitted', order });
  } catch (err) { next(err); }
});

// @route PUT /api/orders/:id/approve-cancel – Manager approves/rejects cancellation
router.put('/:id/approve-cancel', protect, authorize('manager'), async (req, res, next) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.cancellationRequest.status = status;
    if (status === 'Approved') {
      order.status = 'Cancelled';
      order.statusHistory.push({ status: 'Cancelled', note: 'Cancellation approved by manager' });
    }
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// @route PUT /api/orders/:id/approve-replace – Manager approves/rejects replacement
router.put('/:id/approve-replace', protect, authorize('manager'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.replacementRequest.status = status;
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

module.exports = router;
