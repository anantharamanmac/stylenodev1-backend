const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      imageUrl: String, // ✅ keep only 1 thumbnail
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
