// /middleware/authenticate.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ Required to fetch user from DB

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id); // ✅ Fetch full user
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // ✅ Attach full user to request
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authenticate;
