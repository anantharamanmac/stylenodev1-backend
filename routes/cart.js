const express = require("express");
const Cart = require("../models/Cart");

const router = express.Router();

// Get cart by user
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });

  // ✅ Normalize to always return imageUrl with a fallback
  if (cart) {
    cart.items = cart.items.map((item) => ({
      ...item.toObject(),
      imageUrl: item.imageUrl || "/placeholder.png",
    }));
  }

  res.json(cart || { userId: req.params.userId, items: [] });
});
// Get cart summary for a user
router.get("/:userId/summary", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");

    if (!cart) {
      return res.json({
        orderId: `ORD-${Date.now()}`,
        itemsCount: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        items: [],
      });
    }

    const itemsCount = cart.items.length;
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    const shipping = subtotal > 1000 ? 0 : 50; // Example rule
    const tax = Math.round(subtotal * 0.18);   // Example 18% GST
    const total = subtotal + shipping + tax;

    res.json({
      orderId: `ORD-${Date.now()}`,
      itemsCount,
      shipping,
      tax,
      total,
      items: cart.items.map((i) => ({
        name: i.productId.name,
        price: i.productId.price,
        quantity: i.quantity,
      })),
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Add/Update item in cart
router.post("/:userId", async (req, res) => {
  const { productId, name, price, quantity, imageUrl } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });

  if (!cart) {
    cart = new Cart({ userId: req.params.userId, items: [] });
  }

  const itemIndex = cart.items.findIndex((item) => item.productId === productId);

  if (itemIndex > -1) {
    // ✅ update quantity (and update imageUrl if missing)
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].imageUrl = imageUrl || cart.items[itemIndex].imageUrl || "/placeholder.png";
  } else {
    // ✅ push new item
    cart.items.push({
      productId,
      name,
      price,
      quantity,
      imageUrl: imageUrl || "/placeholder.png",
    });
  }

  await cart.save();

  // ✅ ensure normalized response
  const normalized = {
    ...cart.toObject(),
    items: cart.items.map((item) => ({
      ...item.toObject(),
      imageUrl: item.imageUrl || "/placeholder.png",
    })),
  };

  res.json(normalized);
});

// Remove item
router.delete("/:userId/:productId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((item) => item.productId !== req.params.productId);
  await cart.save();

  res.json(cart);
});

module.exports = router;
