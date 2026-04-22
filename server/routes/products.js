const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const {
      search, category, minPrice, maxPrice, size, color, rating,
      featured, trending, sort = '-createdAt', page = 1, limit = 12,
    } = req.query;

    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
    if (size) query.sizes = size;
    if (color) query.colors = { $regex: color, $options: 'i' };
    if (rating) query.ratings = { $gte: Number(rating) };
    if (featured === 'true') query.isFeatured = true;
    if (trending === 'true') query.isTrending = true;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sort).skip(skip).limit(Number(limit));

    res.json({ success: true, count: products.length, total, page: Number(page), pages: Math.ceil(total / Number(limit)), products });
  } catch (err) { next(err); }
});

// @route GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: 'Product not found' });
    const reviews = await Review.find({ product: product._id }).populate('user', 'name avatar').sort('-createdAt');
    res.json({ success: true, product, reviews });
  } catch (err) { next(err); }
});

// @route POST /api/products (Manager)
router.post('/', protect, authorize('manager'), async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
});

// @route PUT /api/products/:id (Manager)
router.put('/:id', protect, authorize('manager'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
});

// @route DELETE /api/products/:id (Manager)
router.delete('/:id', protect, authorize('manager'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product removed' });
  } catch (err) { next(err); }
});

module.exports = router;
