import express from "express";
import { register, login} from "../controllers/auth.js";

const router = express.Router();

/*
  Routes for user authentication (register and login).
*/

// Register a new user.
router.post("/register", register);

// Login an existing user.
router.post("/login", login);

export default router;
