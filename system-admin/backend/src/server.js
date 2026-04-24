import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import Product from "../models/product.js";
import Order from "../models/order.js";

// routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://127.0.0.1:3000", "http://localhost:3000", "http://localhost:5173", "http://192.168.100.11:5500"],                                                       
  credentials: true
}));

// --- ROUTES ---
app.use("/api/admin", authRoutes);
app.use("/api/products", productRoutes);

// New checkout order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
});

// Track a specific order by ID in MongoDB
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found. Please check your ID." });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Invalid Order ID format." });
  }
});

// connect to DB then start server
(async () => {
  try {
    const DB_URI = process.env.MONGO_URI || 'mongodb+srv://127.0.0.1:27017/kapelingka';
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB!");

    app.listen(PORT, () => console.log("Server started on PORT:", PORT));
  } catch (err) {
    console.log("Server failed to start", err);
    process.exit(1);
  }
})();