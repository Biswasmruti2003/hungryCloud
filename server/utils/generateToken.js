const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET is not defined in environment variables");
  } 
  const payload = {
    id: user._id,
    role: user.role,
    // email: user.email, // optional if needed later
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
};

module.exports = generateToken;
