const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// @route GET /api/wishlist
router.get('/', protect, authorize('customer'), async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    res.json({ success: true, wishlist });
  } catch (err) { next(err); }
});

// @route POST /api/wishlist/toggle/:productId
router.post('/toggle/:productId', protect, authorize('customer'), async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    const idx = wishlist.products.indexOf(req.params.productId);
    let added;
    if (idx > -1) {
      wishlist.products.splice(idx, 1);
      added = false;
    } else {
      wishlist.products.push(req.params.productId);
      added = true;
    }

    await wishlist.save();
    res.json({ success: true, added, wishlist });
  } catch (err) { next(err); }
});

module.exports = router;
