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

/* CREATE, UPDATE AND DELETE POLL OPTIONS ROUTES */

router.post("", verifyToken, createPollOption);
router.get("/", verifyToken, getAllPollOptions);
router.get("/:id", verifyToken, getPollOption);
router.put("/:id", verifyToken, updatePollOption);
router.delete("/:id", verifyToken, deletePollOption);

export default router;
