import User from "../models/User.js";
import transporter from "../config/nodemailer.js"; // ✅ use the central transporter

let otpStore = {}; // temporary in-memory OTP store { email: otp }

export const signup = async (req, res) => {
  try {
    const { name, email } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // send email using transporter.js
    await transporter.sendMail({
      from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <b>${otp}</b></p>`, // prettier version
    });

    return res.json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Signup error", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { name, email, otp, password, country, city } = req.body;

    if (!otpStore[email] || otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Save user only after OTP is verified
    const newUser = new User({ name, email, password, country, city });
    await newUser.save();

    delete otpStore[email]; // cleanup after success

    return res.json({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Verification error", error: error.message });
  }
};
