const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authenticate'); // adjust path as needed
const Subscription = require('../models/Subscription'); // adjust path as needed

// POST /api/payment/success
router.post('/success', authMiddleware, async (req, res) => {
  try {
    const { plan, slot, mealOption, duration, days, startDate, address, totalPrice, discount, couponCode } = req.body;

    await Subscription.create({
      userId: req.user._id,
      plan,
      slot,
      mealOption,
      duration,
      days,
      startDate,
      address,
      totalPrice,
      discount,
      couponCode,
      paymentStatus: 'success',
      paidAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Payment save failed:', err);
    res.status(500).json({ success: false, message: 'Payment save failed' });
  }
});

module.exports = router;
