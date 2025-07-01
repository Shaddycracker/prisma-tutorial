import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT!);
    // Optional: attach decoded to req.user
    // req.user = decoded;

    next();
  } catch{
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
