const mongoose = require("mongoose");

// ✅ Embedded Address Schema
const addressSchema = new mongoose.Schema(
  {
    at: { type: String, required: true, trim: true },
    po: { type: String, required: true, trim: true },
    dist: { type: String, required: true, trim: true },
    pin: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{6}$/.test(v),
        message: (props) => `${props.value} is not a valid 6-digit PIN`,
      },
    },
    lat: { type: Number }, // ✅ Added
    lng: { type: Number }, // ✅ Added
  },
  { _id: false }
);


// ✅ Main Subscription Schema
const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      required: true,
      trim: true,
    },
    slot: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Lunch + Dinner"],
    },
    mealOption: {
      type: String,
      required: true,
      enum: ["Veg", "Non-Veg"],
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    selectedDays: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) =>
          arr.every((day) =>
            [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].includes(day)
          ),
        message: "selectedDays must contain valid weekdays only",
      },
    },
    deliveryDates: {
      type: [String], // e.g. ["2025-07-25", "2025-07-27"]
      required: true,
      validate: {
        validator: (arr) =>
          arr.every((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)),
        message: "deliveryDates must be valid YYYY-MM-DD strings",
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      default: "",
      trim: true,
    },
    paymentMode: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// ✅ Index to fetch subscriptions by newest first for a user
subscriptionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Subscription", subscriptionSchema);
