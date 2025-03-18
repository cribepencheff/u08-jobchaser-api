import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  signUp,
  logIn,
  logOut
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", authMiddleware, logOut);

export default router;
