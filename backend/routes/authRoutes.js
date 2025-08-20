import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Admin credentials (hardcoded)
const ADMIN_EMAIL = "adminlogin@gmail.com";
const ADMIN_PASSWORD = "admin@9900";

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, country, city } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, country, city });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login user or admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ message: "Admin login successful", token, role: "admin" });
    }

    // Normal user login
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      return res.json({ message: "User login successful", token, role: "user", user });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

export default router;
