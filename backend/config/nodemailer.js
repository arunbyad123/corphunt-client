// config/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
});

// Test connection with better error handling
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email server connection verified");
  } catch (error) {
    console.error("❌ Email configuration error:", error.message);
    console.log("💡 Troubleshooting tips:");
    console.log("   1. Make sure you're using Gmail App Password, not regular password");
    console.log("   2. Enable 2-factor authentication on your Gmail account");
    console.log("   3. Generate a new App Password at: https://myaccount.google.com/apppasswords");
    console.log("   4. Make sure 'Less secure app access' is enabled (if not using App Password)");
  }
};

// Verify connection on startup
verifyConnection();

export default transporter;