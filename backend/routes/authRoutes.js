// routes/authRoutes.js
import express from "express";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Temporary in-memory OTP store
// { email: { otp, name, createdAt } }
const otpStore = {};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1️⃣ Signup → Send OTP (no DB save yet)
router.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Prevent duplicate accounts
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily
    otpStore[email] = { otp, name, createdAt: Date.now() };

    // Send OTP via email
    await transporter.sendMail({
      from: `"CorpHunt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "CorpHunt Account Verification",
      text: `Hello ${name},\n\nYour CorpHunt account registration one-time password is: ${otp}\n\nThis code is valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup error", error: error.message });
  }
});

// 2️⃣ Verify OTP → Save user to DB
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, password, country, city, otp } = req.body;

    // Check if OTP exists
    if (!otpStore[email]) {
      return res.status(400).json({ message: "No OTP request found for this email." });
    }

    const { otp: storedOtp, name, createdAt } = otpStore[email];

    // Expiry check (5 minutes)
    if (Date.now() - createdAt > 5 * 60 * 1000) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Wrong OTP
    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP is correct → Save user
    const newUser = new User({ name, email, password, country, city });
    await newUser.save();

    // Clear OTP
    delete otpStore[email];

    res.json({ message: "User registered successfully." });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "OTP verification error", error: error.message });
  }
});

// 3️⃣ Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!otpStore[email]) {
      return res.status(400).json({ message: "Signup not started for this email." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { ...otpStore[email], otp, createdAt: Date.now() };

    // Send new OTP
    await transporter.sendMail({
      from: `"CorpHunt" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "CorpHunt OTP Resend",
      text: `Your new OTP is: ${otp}\n\nThis code is valid for 5 minutes.`,
    });

    res.json({ message: "New OTP sent successfully." });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Resend OTP error", error: error.message });
  }
});

export default router;
