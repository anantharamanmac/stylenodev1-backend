const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body; // allow optional isAdmin

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ name, email, password: hashedPassword, isAdmin: !!isAdmin });
    await user.save();

    // Generate JWT including isAdmin
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, // ⚡ include isAdmin here
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT including isAdmin
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, // ⚡ include isAdmin here
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send user data including isAdmin
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
