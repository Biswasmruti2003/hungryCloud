// routes/couponRoute.js

const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

// 🟢 Apply a Coupon
router.post("/use", authenticate, async (req, res) => {
  const { code, plan } = req.body;

  // 🔒 Validate input
  if (!code || !plan) {
    return res.status(400).json({
      success: false,
      message: "Missing coupon code or plan",
    });
  }

  try {
    // 🔍 Find coupon by code (case-insensitive) and plan
    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      plan,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon for this plan",
      });
    }

    // 🚫 Prevent duplicate usage
    if (coupon.usedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "Coupon already used by you",
      });
    }

    // ✅ Log usage
    coupon.usedBy.push(req.user.id);
    await coupon.save();

    return res.json({
      success: true,
      message: `Coupon ${code.toUpperCase()} applied successfully`,
      discount: coupon.discount,
    });

  } catch (err) {
    console.error("❌ Coupon apply error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while applying coupon",
    });
  }
});

module.exports = router;
