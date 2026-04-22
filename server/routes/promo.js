const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route POST /api/promo/validate
router.post('/validate', protect, async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promo) return res.status(404).json({ success: false, message: 'Invalid promo code' });
    if (promo.expiresAt && promo.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'Promo code has expired' });
    if (promo.usedCount >= promo.maxUses) return res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
    if (orderAmount < promo.minOrderAmount) return res.status(400).json({ success: false, message: `Minimum order amount of ₹${promo.minOrderAmount} required` });

    const discount = promo.discountType === 'percentage' ? (orderAmount * promo.discountValue) / 100 : promo.discountValue;
    res.json({ success: true, promo, discount });
  } catch (err) { next(err); }
});

// @route POST /api/promo (Manager create)
router.post('/', protect, authorize('manager'), async (req, res, next) => {
  try {
    const promo = await PromoCode.create(req.body);
    res.status(201).json({ success: true, promo });
  } catch (err) { next(err); }
});

// @route GET /api/promo (Manager list)
router.get('/', protect, authorize('manager'), async (req, res, next) => {
  try {
    const promos = await PromoCode.find().sort('-createdAt');
    res.json({ success: true, promos });
  } catch (err) { next(err); }
});

// @route PUT /api/promo/:id/toggle (Manager)
router.put('/:id/toggle', protect, authorize('manager'), async (req, res, next) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) return res.status(404).json({ success: false, message: 'Promo not found' });
    promo.isActive = !promo.isActive;
    await promo.save();
    res.json({ success: true, promo });
  } catch (err) { next(err); }
});

module.exports = router;
