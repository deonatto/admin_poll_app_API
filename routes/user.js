import express from "express";
import {
  createUser,
  updateUser,
  getUser,
  deleteUser,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE, UPDATE AND DELETE USER ROUTES */

router.post("", verifyToken, createUser);
router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
