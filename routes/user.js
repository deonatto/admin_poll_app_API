import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  updateProfile,
  getUser,
  deleteUser,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Routes for creating, updating and deleting user
 * All routes require a valid token to be passed in headers
 */

// Create a new user
router.post("", verifyToken, createUser);

// Get all users
router.get("/", verifyToken, getAllUsers);

// Get a single user by ID
router.get("/:id", verifyToken, getUser);

// Update a user by ID
router.put("/:id", verifyToken, updateUser);

// Update a user's profile by ID
router.post("/profile/:id", verifyToken, updateProfile);

// Delete a user by ID
router.delete("/:id", verifyToken, deleteUser);

export default router;
