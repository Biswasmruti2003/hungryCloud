// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 📍 Address Sub-Schema
const addressSchema = new mongoose.Schema(
  {
    at: { type: String, required: true, trim: true }, // Address (full)
    po: { type: String, required: true, trim: true }, // Post office or city name
    dist: { type: String, required: true, trim: true }, // District name
    pin: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{6}$/.test(v),
        message: (props) => `${props.value} is not a valid 6-digit PIN`,
      },
    },
    default: { type: Boolean, default: false }, // Whether this address is the default one
  },
  { _id: false }
);

// 📦 Subscription Sub-Schema
const subscriptionSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    plan: { type: String, required: true },
    slot: { type: String, default: "Lunch" },
    mealOption: { type: String, required: true, enum: ["Veg", "Non-Veg"] },
    duration: { type: String, required: true },
    days: { type: Number, required: true },
    startDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    address: { type: addressSchema, required: true },
    active: { type: Boolean, default: true }, // Active subscription flag
    confirmedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  { _id: false }
);

// 👤 Main User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v),
        message: (props) => `${props.value} is not a valid 10-digit phone number`,
      },
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    resetToken: String,
    resetTokenExpire: Date,

    addresses: { type: [addressSchema], default: [] }, // Array of addresses
    credits: { type: Number, default: 0 },
    subscriptions: { type: [subscriptionSchema], default: [] }, // Embedded subscription objects
    transactions: { type: [mongoose.Schema.Types.Mixed], default: [] },

  },
  { timestamps: true }
);

// 🔐 Hash password before saving if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✂️ Hide sensitive fields in toJSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetToken;
  delete obj.resetTokenExpire;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
