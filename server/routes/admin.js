const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getDashboardStats,
  getAllSubscriptions,
  cancelSubscription,
  getAllUsers,                 // ✅ Fetch all users with orders
  getSubscriptionsByUser,     // ✅ Fetch specific user subscriptions
} = require("../controllers/adminController");

const authenticateAdmin = require("../middleware/authenticateAdmin");

// ✅ Admin Login
router.post("/login", adminLogin);

// ✅ Dashboard Overview (metrics, revenue, user-wise stats)
router.get("/dashboard", authenticateAdmin, getDashboardStats);

// ✅ All Subscriptions (with users)
router.get("/subscriptions", authenticateAdmin, getAllSubscriptions);

// ✅ Cancel a Subscription
router.put("/cancel-subscription/:id", authenticateAdmin, cancelSubscription);

// ✅ All Users with Their Orders
router.get("/users", authenticateAdmin, getAllUsers);

// ✅ Specific User Subscriptions (for expand arrow)
router.get("/user-subscriptions/:userId", authenticateAdmin, getSubscriptionsByUser);

module.exports = router;
