const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User"); // Adjust path if needed

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // 1️⃣ Remove old admin@example.com if exists
    const oldAdminDelete = await User.deleteOne({ email: "admin@example.com" });
    if (oldAdminDelete.deletedCount > 0) {
      console.log("🗑️ Old admin (admin@example.com) removed");
    }

    // 2️⃣ Remove nutriadmin@gmail.com if exists
    const newAdminDelete = await User.deleteOne({ email: "nutriadmin@gmail.com" });
    if (newAdminDelete.deletedCount > 0) {
      console.log("🗑️ Previous nutriadmin@gmail.com removed");
    }

    // 3️⃣ Create new admin
    const newAdmin = new User({
      name: "HungryCloud",
      email: "hungrycloud@gmail.com",
      phone: "9999999999",
      password: "hungrycloud", // Plain text → will be hashed by schema's pre-save hook
      role: "admin",
    });

    await newAdmin.save();
    console.log("✅ New admin created successfully");

    // Close connection
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
