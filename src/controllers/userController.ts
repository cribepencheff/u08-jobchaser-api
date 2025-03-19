import { Response } from "express";
import { ProtectedRequest } from "../middleware/auth";
import prisma from "../config/db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const getUserProfile = async (req: ProtectedRequest, res: Response) => {
  // Get user from JWT
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
    return;

  } catch (err) {
    res.status(500).json({
      message: "Error fetching user profile.",
      error: (err as Error).message
    });
    return;
  }
};

export const updatePassword = async (req: ProtectedRequest, res: Response) => {
  try {
    // Get user from JWT
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: "Both oldPassword and newPassword are required." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // client PW matches JWT PW
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Incorrect old password." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully.", user: updatedUser.email });
    return;

  } catch (err) {
    res.status(500).json({
      message: "Error updating password.",
      error: (err as Error).message
    });
    return;
  }
};

export const deleteUser = async (req: ProtectedRequest, res: Response) => {
  try {
    // Get user from JWT
    const userId = req.user?.id;
    await prisma.user.delete({ where: { id: userId }});

    res.status(204).json({ message: "User deleted successfully." });
    return;

  } catch (error) {
    res.status(500).json({ message: "Error deleting user." });
    return;
  }
};
