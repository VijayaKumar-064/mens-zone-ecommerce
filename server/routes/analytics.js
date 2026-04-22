const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route GET /api/analytics/summary
router.get('/summary', protect, authorize('manager'), async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const ordersByStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

    const recentOrders = await Order.find().populate('user', 'name email').sort('-createdAt').limit(5);

    // Revenue last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const revenueByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top products by revenue
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
    ]);

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Pending approvals count
    const pendingCancellations = await Order.countDocuments({ 'cancellationRequest.status': 'Pending', 'cancellationRequest.requested': true });
    const pendingReplacements = await Order.countDocuments({ 'replacementRequest.status': 'Pending', 'replacementRequest.requested': true });

    res.json({
      success: true,
      summary: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts,
        totalCustomers,
        pendingCancellations,
        pendingReplacements,
      },
      ordersByStatus,
      recentOrders,
      revenueByDay,
      topProducts,
      categoryBreakdown,
    });
  } catch (err) { next(err); }
});

module.exports = router;
