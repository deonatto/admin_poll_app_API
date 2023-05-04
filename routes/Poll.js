import express from "express";
import {
  createPoll,
  getAllPolls,
  getPoll,
  updatePoll,
  deletePoll,
  getPolls
} from "../controllers/poll.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Routes related to creating, updating and deleting polls
 */

// Route to create a new poll
router.post("", verifyToken, createPoll);

// Route to get all polls created by the authenticated user
router.get("/", verifyToken, getAllPolls);

// Route to get all polls
router.get("/all", verifyToken, getPolls);

// Route to get a poll by id
router.get("/:id", verifyToken, getPoll);

// Route to update a poll by id
router.put("/:id", verifyToken, updatePoll);

// Route to delete a poll by id
router.delete("/:id", verifyToken, deletePoll);

export default router;
