const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Admin token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // You can optionally fetch admin user from DB using decoded.id or email
    // const adminUser = await Admin.findById(decoded.id);
    // if (!adminUser) return res.status(404).json({ success: false, message: "Admin not found" });

    req.admin = decoded; // Attach decoded admin info to request
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticateAdmin;
