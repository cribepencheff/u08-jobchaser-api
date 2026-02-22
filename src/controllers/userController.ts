import { Response } from "express";
import { ProtectedRequest } from "../middleware/auth";
import prisma from "../config/db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const getUserProfile = async (req: ProtectedRequest, res: Response) => {
  // Get user from JWT
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ messageKey: "unauthorized_no_token" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ messageKey: "user_not_found" });
      return;
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ messageKey: "unknown_error" });
    return;
  }
};

export const updatePassword = async (req: ProtectedRequest, res: Response) => {
  try {
    // Get user from JWT
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        messageKey: "missing_old_or_new_password",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        messageKey: "user_not_found",
      });
      return;
    }

    // client PW matches JWT PW
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ messageKey: "incorrect_old_password" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      messageKey: "password_updated_successfully",
      user: updatedUser.email,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ messageKey: "unknown_error" });
    return;
  }
};

export const deleteUser = async (req: ProtectedRequest, res: Response) => {
  try {
    // Get user from JWT
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({
        messageKey: "user_not_found",
      });
      return;
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ messageKey: "user_deleted_successfully" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ messageKey: "unknown_error" });
    return;
  }
};
