import express from "express";
import { signup, verifyOtp, resendOtp, login } from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);

export default router;