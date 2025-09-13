const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration using environment variable
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", // set your Vercel frontend URL in .env
  credentials: true,
};
app.use(cors(corsOptions));

// Request logging (optional, helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const heroRoutes = require("./routes/hero");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const userProfileRoutes = require("./routes/userProfile");

app.use("/api/orders", orderRoutes);
app.use("/api/user", userProfileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/cart", cartRoutes);

// Protected route example
const authMiddleware = require("./middleware/auth");
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.user.id });
});

// Default route for base URL
app.get("/", (req, res) => {
  res.json({ message: "Stylenod Backend is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
