import { Request, Response } from "express";
import { AppError } from "../error/error";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/env";
import { AuthRequest } from "../types/RequestWithMiddleware";
const prisma = new PrismaClient();


class UserController {
    constructor() {
    }

    async getUser(req: AuthRequest, res: Response) {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            select: { id: true, email: true, name: true, role:true },
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    }

    async logout(req: Request, res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: config.env === "production",
            sameSite: "strict",
        })

        res.json({ success: true, message: "Logged out successfully" })
    };

}

export const userController = new UserController();