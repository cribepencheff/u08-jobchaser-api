import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getSavedJobs,
  saveJob,
  removeSavedJob
} from "../controllers/savedJobsController";

const router = express.Router();

router.get("/", authMiddleware, getSavedJobs);
router.post("/", authMiddleware, saveJob);
router.delete("/:jobId", authMiddleware, removeSavedJob);

export default router;
