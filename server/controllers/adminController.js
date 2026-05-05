const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

// ✅ Admin Login Controller
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await User.findOne({ email });

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or unauthorized",
      });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Dashboard Stats Controller
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Subscription.countDocuments();
    const activeSubs = await Subscription.countDocuments({ status: "active" });

    const revenueAggregate = await Subscription.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const revenue = revenueAggregate[0]?.total || 0;

    const popularPlanAggregate = await Subscription.aggregate([
      { $group: { _id: "$plan", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const popularPlan = popularPlanAggregate[0]?._id || "None";

    const userRevenue = await Subscription.aggregate([
      {
        $group: {
          _id: "$user",
          orders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          name: "$userDetails.name",
          email: "$userDetails.email",
          phone: "$userDetails.phone",
          orders: 1,
          totalSpent: 1,
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);

    res.json({
      success: true,
      totalOrders,
      activeSubs,
      revenue,
      popularPlan,
      userRevenue,
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

// ✅ Get All Subscriptions (for subscription page)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({})
      .populate({
        path: "user",
        select: "name email phone",
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 });

    console.log("✅ Subscriptions fetched:", subs.length);

    res.json({ success: true, subscriptions: subs });
  } catch (err) {
    console.error("❌ Fetch subscriptions error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions",
    });
  }
};

// ✅ Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  const subId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(subId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid subscription ID",
    });
  }

  try {
    const sub = await Subscription.findById(subId);
    if (!sub) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    if (sub.status && sub.status.toLowerCase() === "cancelled") {
      return res.status(400).json({ success: false, message: "Already cancelled" });
    }

    sub.status = "cancelled";
    await sub.save();

    console.log(`✅ Subscription ${subId} cancelled successfully`);

    res.json({ success: true, message: "Subscription cancelled successfully" });
  } catch (err) {
    console.error("❌ Cancel subscription error:", err); 
    res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
      error: err.message,
    });
  }
};

// ✅ Get All Users with Orders
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email phone").lean();

    const userIds = users.map((u) => u._id);
    const subscriptions = await Subscription.find({ user: { $in: userIds } })
      .select("plan status totalPrice createdAt user")
      .sort({ createdAt: -1 }) // Sort orders by latest
      .lean();

    const grouped = {};
    subscriptions.forEach((sub) => {
      const userId = sub.user.toString();
      if (!grouped[userId]) grouped[userId] = [];
      grouped[userId].push(sub);
    });

    const usersWithOrders = users.map((user) => ({
      ...user,
      orders: grouped[user._id.toString()] || [],
    }));

    res.json({ success: true, users: usersWithOrders });
  } catch (err) {
    console.error("❌ Fetch users error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ✅ Get Subscriptions by Specific User
exports.getSubscriptionsByUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  try {
    const subscriptions = await Subscription.find({ user: userId })
      .sort({ createdAt: -1 }); // Sort: latest orders first

    res.json({ success: true, subscriptions });
  } catch (err) {
    console.error("❌ User subscription fetch error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user subscriptions",
    });
  }
};
