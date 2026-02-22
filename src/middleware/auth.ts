import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface ProtectedRequest extends Request {
  user?: JwtPayload;
}

const { JWT_SECRET } = process.env;

export const authMiddleware = (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction,
) => {
  // Request token HttpOnly-cookie
  const token = req.cookies.auth_token;

  // HttpOnly-cookie token check
  if (!token) {
    res.status(401).json({ messageKey: "unauthorized_no_token" });
    return;
  }

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  // Verify token with verify()
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    // console.log("Req user: ", req.user);
    next();
  } catch (err) {
    // console.log(err);
    res.status(401).json({ messageKey: "unauthorized_invalid_token" });
    return;
  }
};
