import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

export const createJWT = (user: User) => {
  return jwt.sign(
    {id: user.id, email: user.email},
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  )
}
