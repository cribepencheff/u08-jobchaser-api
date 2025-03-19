import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getUserProfile,
  updatePassword,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/me", authMiddleware, getUserProfile);
router.put("/me/password", authMiddleware, updatePassword);
router.delete("/me", authMiddleware, deleteUser);

export default router;
