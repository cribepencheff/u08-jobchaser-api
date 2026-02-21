import { Request, Response } from "express";
import { createJWT } from "../utils/utils";
import prisma from "../config/db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      res.status(409).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Saved hashed PW to DB
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "User created successfully.", user: user.email });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user." });
    return;
  }
};

export const logIn = async (req: Request, res: Response) => {
  try {
    // Find user in DB by email (@unique)
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // If user not in DB
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // If passwords match
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // If user authorized (authenticated/auth) then create JWT (JSON Web Token)
    const token = createJWT(user);
    const expirationDays = parseInt(process.env.JWT_EXPIRATION_DAYS || "7", 10);

    // Set the token in an HttpOnly-cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: expirationDays * 1000 * 60 * 60 * 24, // Converts to ms
      partitioned: true, // Required in Chrome to allow third-party cookies (new)
    });

    // console.log(token);
    res.status(200).json({ message: "Logged in successfully." });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in." });
    return;
  }
};

export const logOut = (req: Request, res: Response) => {
  try {
    // Clear HttpOnly-cookies
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully." });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging out." });
    return;
  }
};
