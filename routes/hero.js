// routes/hero.js
const express = require("express");
const Hero = require("../models/Hero");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all hero banners (public)
router.get("/", async (req, res) => {
  try {
    const banners = await Hero.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new banner (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

    const banner = new Hero(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete banner (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

    const banner = await Hero.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
