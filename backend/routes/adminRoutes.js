import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Add a new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, country, city } = req.body;
    const user = new User({ name, email, password, country, city });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Update a user
router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
