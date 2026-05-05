const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// GET /profile — Fetch user + subscriptions
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const subscriptions = await Subscription.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        credits: user.credits || 0,
        addresses: user.addresses || [],
        subscriptions,
        transactions: user.transactions || [],
      },
    });
  } catch (err) {
    console.error("❌ Error in GET /profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /update — Update user info
router.put("/update", verifyToken, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name.trim();
    if (email) user.email = email.trim();
    if (phone) user.phone = phone.trim();

    await user.save();

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("❌ Error in PUT /update:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

// DELETE /delete — Delete account
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("❌ Error in DELETE /delete:", err);
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
});

// POST /address — Add new address
router.post("/address", verifyToken, async (req, res) => {
  const { address } = req.body;
  if (
    !address ||
    !address.at?.trim() ||
    !address.po?.trim() ||
    !address.dist?.trim() ||
    !address.pin?.trim()
  ) {
    return res.status(400).json({ success: false, message: "All address fields are required" });
  }
  if (!/^\d{6}$/.test(address.pin.trim())) {
    return res.status(400).json({ success: false, message: "PIN must be a valid 6-digit number" });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // If new address is default, unset previous defaults
    if (address.default) {
      user.addresses.forEach(addr => (addr.default = false));
    }
    
    user.addresses.push({
      at: address.at.trim(),
      po: address.po.trim(),
      dist: address.dist.trim(),
      pin: address.pin.trim(),
      default: Boolean(address.default),
    });

    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error("❌ Error in POST /address:", err);
    res.status(500).json({ success: false, message: "Failed to add address" });
  }
});

// GET /address — Get all addresses
router.get("/address", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    console.error("❌ Error in GET /address:", err);
    res.status(500).json({ success: false, message: "Failed to fetch addresses" });
  }
});

// PUT /address — Update or delete address by index
router.put("/address", verifyToken, async (req, res) => {
  const { index, updatedAddress } = req.body;
  if (typeof index !== "number") {
    return res.status(400).json({ success: false, message: "Index must be a number" });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!Array.isArray(user.addresses)) user.addresses = [];

    if (index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ success: false, message: "Index out of range" });
    }

    if (!updatedAddress) {
      // Delete address
      user.addresses.splice(index, 1);
    } else {
      let { at, po, dist, pin, default: isDefault } = updatedAddress;
      at = typeof at === "string" ? at.trim() : "";
      po = typeof po === "string" ? po.trim() : "";
      dist = typeof dist === "string" ? dist.trim() : "";
      pin = typeof pin === "string" ? pin.trim() : "";

      if (!at || !po || !dist || !pin) {
        return res.status(400).json({ success: false, message: "All address fields are required" });
      }
      if (!/^\d{6}$/.test(pin)) {
        return res.status(400).json({ success: false, message: "PIN must be a valid 6-digit number" });
      }
      isDefault = Boolean(isDefault);

      if (isDefault) {
        user.addresses.forEach(addr => (addr.default = false));
      }
      user.addresses[index] = { at, po, dist, pin, default: isDefault };
    }

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error("❌ Error in PUT /address:", err);
    res.status(500).json({ success: false, message: "Failed to update address" });
  }
});

// DELETE /address — Delete user address by index
router.delete("/address", verifyToken, async (req, res) => {
  try {
    const { index } = req.body;
    if (typeof index !== "number") {
      return res.status(400).json({ success: false, message: "Index must be a number" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!Array.isArray(user.addresses)) user.addresses = [];

    if (index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ success: false, message: "Index out of range" });
    }
    user.addresses.splice(index, 1);

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error("❌ Error in DELETE /address:", err);
    res.status(500).json({ success: false, message: "Failed to delete address" });
  }
});

module.exports = router;
