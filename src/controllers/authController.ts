import { Request, Response } from "express";
import { createJWT } from "../utils/utils";
import prisma from "../config/db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const isProd = process.env.NODE_ENV === "production";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { firstName, email, password } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      res.status(409).json({ messageKey: "user_already_exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Saved hashed PW to DB
    const user = await prisma.user.create({
      data: { firstName, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ messageKey: "user_created_successfully", user: user.email });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ messageKey: "unknown_error" });
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
      res.status(404).json({ messageKey: "user_not_found" });
      return;
    }

    // If passwords match
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ messageKey: "invalid_credentials" });
      return;
    }

    // If user authorized (authenticated/auth) then create JWT (JSON Web Token)
    const token = createJWT(user);
    const expirationDays = parseInt(process.env.JWT_EXPIRATION_DAYS || "7", 10);

    // Set the token in an HttpOnly-cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: expirationDays * 1000 * 60 * 60 * 24, // Converts to ms
      ...(isProd && { partitioned: true }), // Required in Chrome to allow third-party cookies (new)
    });

    // console.log(token);
    res.status(200).json({ messageKey: "login_successful" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ messageKey: "unknown_error" });
    return;
  }
};

export const logOut = (req: Request, res: Response) => {
  try {
    // Clear HttpOnly-cookies
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    res.status(200).json({ messageKey: "logout_successful" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ messageKey: "unknown_error" });
    return;
  }
};
