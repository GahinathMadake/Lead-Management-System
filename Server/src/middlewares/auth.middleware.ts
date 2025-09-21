import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if(!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);
    (req as any).user = decoded;
    next();
  } 
  catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
