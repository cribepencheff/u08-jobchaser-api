import express from "express";
import { authMiddleware } from "../middleware/auth";
import { validateUser, validateLogin } from "../middleware/validator";
import { signUp, logIn, logOut } from "../controllers/authController";

const router = express.Router();

router.post("/signup", validateUser, signUp);
router.post("/login", validateLogin, logIn);
router.post("/logout", authMiddleware, logOut);

export default router;
