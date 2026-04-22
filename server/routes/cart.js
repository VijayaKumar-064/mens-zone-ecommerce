const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route GET /api/cart
router.get('/', protect, authorize('customer'), async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json({ success: true, cart });
  } catch (err) { next(err); }
});

// @route POST /api/cart/add
router.post('/add', protect, authorize('customer'), async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(
      (i) => i.product.toString() === productId && i.size === size && i.color === color
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size: size || product.sizes[0] || 'M', color: color || '' });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, cart });
  } catch (err) { next(err); }
});

// @route PUT /api/cart/:itemId
router.put('/:itemId', protect, authorize('customer'), async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, cart: updatedCart });
  } catch (err) { next(err); }
});

// @route DELETE /api/cart/:itemId
router.delete('/:itemId', protect, authorize('customer'), async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, cart: updatedCart });
  } catch (err) { next(err); }
});

// @route DELETE /api/cart
router.delete('/', protect, authorize('customer'), async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { next(err); }
});

module.exports = router;
