import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface ProtectedRequest extends Request {
  user?: JwtPayload
}

const { JWT_SECRET } = process.env;

export const authMiddleware = (req: ProtectedRequest, res: Response, next: NextFunction) => {
  // Request bearer token from request-headern (Brearer: _ )
  const bearerToken = req.headers.authorization?.split(" ")[1];

  // Bearer token check
  if (!bearerToken) {
    res.status(401).json({ message: "Unauthorized request. Token does not exist." });
    return;
  }

  if (!JWT_SECRET) {
    res.status(500).json({ message: "JWT_SECRET is not defined"});
  }

  // Verify token with verify()
  try {
    const decoded = jwt.verify(bearerToken, JWT_SECRET as string) as JwtPayload;
    req.user = decoded;
    console.log("Req user: ", req.user);
    next();

  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized request. Invalid token." })
  }
}
