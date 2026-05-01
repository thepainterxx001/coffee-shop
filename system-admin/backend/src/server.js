import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

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

// ──── REGISTER A NEW USER ─────────────
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // new user
    const newUser = new User({ name, email, password });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ──── LOGIN AN EXISTING USER ─────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(`\nLOGIN ATTEMPT: Email received is "${email}"`);

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // console.log("Could not find this email in MongoDB!");
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // console.log("Found the user in MongoDB!");

    // un-hash and check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // console.log("Password does not match!");
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // console.log("Password match!");

    // generate a security token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful!",
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// New checkout order
app.post('/api/orders/add-order', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
});

// Get all orders
app.get('/api/orders/all-order', async (req, res) => {
  try {
    const allOrder = await Order.find();
    res.status(200).json({ allOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

// Mark order as paid/pending
app.put('/api/orders/all-order/:id', async (req, res) => {
  try {
    const { paid } = req.body;

    const paidOrder = await Order.findByIdAndUpdate(req.params.id, {
      status: paid ? "success" : "pending"
    }, { returnDocument: true });

    if (!paidOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    const message = paid
    ? "Order successfully paid"
    : "Order status updated to pending";

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
});

// Remove order
app.delete('/api/orders/all-order/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json({ message: "Order has removed." });
  } catch (error) {
    console.error("Error removing order:", error);
    res.status(500).json({ message: "Failed to remove order", error: error.message });
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