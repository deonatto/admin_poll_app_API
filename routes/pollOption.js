import express from "express";
import {
  createPollOption,
  getAllPollOptions,
  getPollOption,
  updatePollOption,
  deletePollOption,
} from "../controllers/pollOption.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Poll option creation, update and deletion routes
 */

//Route to create a new poll option
router.post("", verifyToken, createPollOption);

//Route to get all the poll options
router.get("/", verifyToken, getAllPollOptions);

//Route to get a single poll option by ID
router.get("/:id", verifyToken, getPollOption);

//Route to update a poll option by ID
router.put("/:id", verifyToken, updatePollOption);

//Route to delete a poll option by ID
router.delete("/:id", verifyToken, deletePollOption);

export default router;
