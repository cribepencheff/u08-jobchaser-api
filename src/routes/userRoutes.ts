import express from "express";
import { authMiddleware } from "../middleware/auth";
import { validateUser, validateUserUpdate } from "../middleware/validator";
import {
  getUserProfile,
  updatePassword,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/me", authMiddleware, getUserProfile);
router.put("/me/password", authMiddleware, validateUserUpdate, updatePassword);
router.delete("/me", authMiddleware, deleteUser);

export default router;
