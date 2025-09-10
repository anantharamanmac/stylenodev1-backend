// models/Hero.js
const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    heading: { type: String, required: true },
    subText: { type: String },
    buttonText: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);
