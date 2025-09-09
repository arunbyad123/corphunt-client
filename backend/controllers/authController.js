// ===== controllers/authController.js =====
import User from "../models/User.js";
import transporter from "../config/nodemailer.js";
import jwt from "jsonwebtoken";

// In-memory OTP store (use Redis in production)
const otpStore = new Map();
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Step 1: Send OTP for signup
export const signup = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    console.log("Signup request received:", { name, email, phone });

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP temporarily
    otpStore.set(emailLower, {
      otp,
      name: name.trim(),
      phone: phone ? phone.trim() : "",
      createdAt: Date.now()
    });

    console.log(`Generated OTP for ${emailLower}: ${otp}`);

    // Send OTP email
    const mailOptions = {
      from: `"CorpHunt Support" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "CorpHunt - Email Verification",
      text: `Hello ${name},\n\nYour verification code is: ${otp}\n\nThis code is valid for 5 minutes.\n\nBest regards,\nCorpHunt Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 28px; font-weight: bold; color: #007bff; letter-spacing: 2px;">${otp}</span>
          </div>
          <p>This code is valid for 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>CorpHunt Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${emailLower}`);

    return res.json({ 
      message: "OTP sent to your email. Please verify to complete registration." 
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      message: "Failed to send OTP", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Step 2: Verify OTP and create user
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, password, country, city } = req.body;

    console.log("OTP verification request:", { email, otp: "***", country, city });

    // Validate required fields
    if (!email || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and password are required" });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if OTP exists
    const otpData = otpStore.get(emailLower);
    if (!otpData) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    console.log(`Verifying OTP: ${otp} vs stored: ${otpData.otp}`);

    // Check OTP expiry
    if (Date.now() - otpData.createdAt > OTP_EXPIRY) {
      otpStore.delete(emailLower);
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Verify OTP
    if (otpData.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Double-check user doesn't exist
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      otpStore.delete(emailLower);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      name: otpData.name,
      email: emailLower,
      password: password.trim(),
      phone: otpData.phone,
      country: country ? country.trim() : "",
      city: city ? city.trim() : "",
      isVerified: true
    });

    await newUser.save();
    console.log(`✅ User created: ${emailLower}`);

    // Cleanup OTP
    otpStore.delete(emailLower);

    return res.json({ 
      message: "Account created successfully! You can now login.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ 
      message: "Account creation failed", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if OTP request exists
    const otpData = otpStore.get(emailLower);
    if (!otpData) {
      return res.status(400).json({ message: "No signup process found. Please start signup again." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update stored data
    otpStore.set(emailLower, {
      ...otpData,
      otp,
      createdAt: Date.now()
    });

    console.log(`Resent OTP for ${emailLower}: ${otp}`);

    // Send new OTP
    await transporter.sendMail({
      from: `"CorpHunt Support" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "CorpHunt - New Verification Code",
      text: `Hello ${otpData.name},\n\nYour new verification code is: ${otp}\n\nThis code is valid for 5 minutes.\n\nBest regards,\nCorpHunt Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Verification Code</h2>
          <p>Hello <strong>${otpData.name}</strong>,</p>
          <p>Your new verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 28px; font-weight: bold; color: #007bff; letter-spacing: 2px;">${otp}</span>
          </div>
          <p>This code is valid for 5 minutes.</p>
          <p>Best regards,<br>CorpHunt Team</p>
        </div>
      `,
    });

    return res.json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ 
      message: "Failed to resend OTP", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const emailLower = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log(`✅ User logged in: ${emailLower}`);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        city: user.city
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      message: "Login failed", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};