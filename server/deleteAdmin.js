require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

User.deleteOne({ email: "admin@example.com" })
  .then(() => {
    console.log("❌ Old admin deleted");
    process.exit();
  })
  .catch((err) => {
    console.error("Error deleting admin:", err);
    process.exit(1);
  });
