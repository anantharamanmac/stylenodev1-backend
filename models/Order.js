const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: Number,
        imageUrl: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    address: {
      street: String,
      city: String,
      postalCode: String,
    },
    status: { type: String, default: "Pending" }, // Pending, Shipped, Delivered, Cancelled
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
