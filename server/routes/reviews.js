const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route GET /api/reviews/:productId
router.get('/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name avatar').sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
});

// @route POST /api/reviews/:productId
router.post('/:productId', protect, authorize('customer'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    // Check verified purchase
    const order = await Order.findOne({ user: req.user._id, 'items.product': req.params.productId, status: 'Delivered' });

    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      name: req.user.name,
      rating: req.body.rating,
      title: req.body.title || '',
      comment: req.body.comment,
      isVerifiedPurchase: !!order,
      orderId: order ? order.orderId : '',
    });

    // Update product ratings
    const allReviews = await Review.find({ product: req.params.productId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(req.params.productId, { ratings: avg.toFixed(1), numReviews: allReviews.length });

    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
});

// @route DELETE /api/reviews/:reviewId
router.delete('/:reviewId', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'manager')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await review.deleteOne();
    const allReviews = await Review.find({ product: review.product });
    const avg = allReviews.length ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 0;
    await Product.findByIdAndUpdate(review.product, { ratings: avg.toFixed(1), numReviews: allReviews.length });

    res.json({ success: true, message: 'Review removed' });
  } catch (err) { next(err); }
});

module.exports = router;
