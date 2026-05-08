// server.js (or index.js)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");


// ✅ Load environment variables from .env
dotenv.config();

// ✅ Initialize app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Handle plain text POST body (e.g., Postman text)
app.use((req, res, next) => {
  if (req.headers["content-type"] === "text/plain") {
    let raw = "";
    req.on("data", chunk => (raw += chunk));
    req.on("end", () => {
      try {
        req.body = JSON.parse(raw);
      } catch (err) {
        console.error("❌ Invalid plain JSON:", err.message);
      }
      next();
    });
  } else {
    next();
  }
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));             // Auth Routes
app.use("/api/user", require("./routes/information"));      // User Info Routes
app.use("/api/subscribe", require("./routes/subscribe"));   // Subscription Routes
app.use("/api/coupon", require("./routes/coupon"));         // Coupon Routes
app.use("/api/payment", require("./routes/payment"));       // Payment Routes
app.use("/api/admin", require("./routes/admin"));           // Admin Routes

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("☁️ HungryCloud Backend API Running ✅");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT} | Mode: ${process.env.NODE_ENV || "development"}`);
});
