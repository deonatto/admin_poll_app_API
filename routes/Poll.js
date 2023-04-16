import express from "express";
import {
  createPoll,
  getAllPolls,
  getPoll,
  updatePoll,
  deletePoll,
} from "../controllers/Poll.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* CREATE, UPDATE AND DELETE POLL ROUTES */

router.post("", verifyToken, createPoll);
router.get("/", verifyToken, getAllPolls);
router.get("/:id", verifyToken, getPoll);
router.put("/:id", verifyToken, updatePoll);
router.delete("/:id", verifyToken, deletePoll);

export default router;
