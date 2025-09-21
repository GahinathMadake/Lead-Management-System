import { Request as ExpressRequest } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends ExpressRequest {
  user?: JwtPayload & {
    userId: number;
    email: string;
  };
}
