import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const jwtSecret = process.env.JWT_SECRET as string;
const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

export const createJWT = (user: User) => {
  return jwt.sign(
    {id: user.id, email: user.email},
    jwtSecret,
    { expiresIn } as jwt.SignOptions
  )
}
