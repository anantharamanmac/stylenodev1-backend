const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const hero = require("./routes/hero");
const cartRoutes = require("./routes/cart");


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");

app.use("/api/products", productRoutes);   // Public product routes
app.use("/api/auth", authRoutes);           // Authentication routes
app.use("/api/hero", require("./routes/hero"));
app.use("/api/cart", cartRoutes);



// Optional: Example protected route
const authMiddleware = require("./middleware/auth");
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.user.id });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
