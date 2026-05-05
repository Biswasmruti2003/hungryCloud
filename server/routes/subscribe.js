const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Subscription = require("../models/Subscription");

// POST / — Create a new subscription (COD or Online)
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      plan,
      slot,
      mealOption,
      duration,
      days,
      startDate,
      address,
      totalPrice,
      discount = 0,
      couponCode = "",
      selectedDays = [],   // Expected to be array of strings e.g. ["Monday", "Wednesday"]
      deliveryDates = [],  // Optional, may be empty
      paymentMode = "COD"  // "COD" or "Online"
    } = req.body;

    // Validate required fields presence
    if (
      !plan ||
      !slot ||
      !mealOption ||
      !duration ||
      !days ||
      !startDate ||
      !address ||
      !address.at ||
      !address.po ||
      !address.dist ||
      !address.pin ||
      totalPrice == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate selectedDays is an array
    if (!Array.isArray(selectedDays)) {
      return res.status(400).json({
        success: false,
        message: "`selectedDays` must be an array like ['Monday', 'Wednesday']",
      });
    }

    // Normalize address lat/lng to allow nulls
    const finalAddress = {
      at: address.at,
      po: address.po,
      dist: address.dist,
      pin: address.pin,
      lat: address.lat ?? null,
      lng: address.lng ?? null,
    };

    // Create new Subscription document
    const newSub = new Subscription({
      user: req.user._id, // Use consistent id key from JWT payload
      plan,
      slot,
      mealOption,
      duration,
      days,
      startDate: new Date(startDate), // Consider validation/parsing on frontend
      address: finalAddress,
      totalPrice,
      discount,
      couponCode,
      paymentMode,
      selectedDays,
      deliveryDates,
      status: "active",
      createdAt: new Date(), // UTC date-time
    });

    await newSub.save();

    return res.json({
      success: true,
      message: "Subscription saved successfully",
      subscriptionId: newSub._id,
    });

  } catch (err) {
    console.error("❌ Subscribe Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while saving subscription.",
    });
  }
});

// PUT /cancel/:id — Cancel a subscription by ID
router.put("/cancel/:id", authenticate, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!sub) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    sub.status = "cancelled";
    sub.cancelledAt = new Date();
    await sub.save();

    return res.json({
      success: true,
      message: "Subscription cancelled",
    });

  } catch (err) {
    console.error("❌ Cancel Error:", err);
    return res.status(500).json({
      success: false,
      message: "Cancel failed",
    });
  }
});

module.exports = router;
