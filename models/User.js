const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  postalCode: String,
  country: { type: String, default: "India" }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    address: addressSchema // ✅ new embedded address schema
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
