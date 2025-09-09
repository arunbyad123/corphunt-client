import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Add a new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, country, city, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password, 
      country: country || "", 
      city: city || "", 
      phone: phone || "",
      isVerified: true 
    });
    await user.save();
    
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// Update a user
router.put("/users/:id", async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

export default router;
