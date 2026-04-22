const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @route POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { name, email, password, phone } = req.body;
      // Only customer registration is public
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

      const user = await User.create({ name, email, password, phone, role: 'customer' });
      res.status(201).json({ success: true, token: generateToken(user._id), user });
    } catch (err) { next(err); }
  }
);

// @route POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
      if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });
      res.json({ success: true, token: generateToken(user._id), user });
    } catch (err) { next(err); }
  }
);

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @route PUT /api/auth/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, addresses },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// @route PUT /api/auth/password
router.put('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully', token: generateToken(user._id) });
  } catch (err) { next(err); }
});

module.exports = router;
