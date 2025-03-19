import express from "express";
import { authMiddleware } from "../middleware/auth";
import { validateUser } from "../middleware/validator";
import {
  signUp,
  logIn,
  logOut
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", validateUser, signUp);
router.post("/login", validateUser, logIn);
router.post("/logout", authMiddleware, logOut);

export default router;
