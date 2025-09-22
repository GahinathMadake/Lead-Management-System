import { Request, Response } from "express";
import { AppError } from "../error/error";
import { EmailResponse, sendMail } from "../utils/SendEmail";
import crypto from "crypto";
import NodeCache from "node-cache";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/env";
const prisma = new PrismaClient();

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

class AuthController {
    constructor() {
    }

    static generateOtp(length = 6): string {
        if (length <= 0) throw new Error("Invalid OTP length");

        const max = 10 ** length;
        const n = crypto.randomInt(0, max);
        return n.toString().padStart(length, "0");
    }

    async sentOTP(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            throw new AppError("Email is required", 400);
        }

        let otp = AuthController.generateOtp();

        const subject = "LeadFlow OTP Code";
        const body = `<h1>Your OTP Code is ${otp}.</h1> <p>This code is valid for 5 minutes.</p>`;

        const emailRes: EmailResponse = await sendMail(email, subject, body);

        if (emailRes.success == false) {
            throw new AppError(`Failed to send OTP. Reason : ${emailRes.message}`, 502);
        }

        cache.set(`OTP_${email}`, otp, 300);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    }

    async Register(req: Request, res: Response) {
        const { fname, lname, email, phone, password, otp } = req.body;


        if (!fname || !lname || !email || !phone || !password || !otp) {
            throw new AppError("All fields are required", 400);
        }

        // check user exists
        const existUser = await prisma.user.findUnique({ where: { email } });
        if (existUser) {
            throw new AppError("User already exists", 400);
        }

        // OTP verification
        const cachedOtp = cache.get(`OTP_${email}`);
        if (!cachedOtp || cachedOtp !== otp) {
            throw new AppError("Invalid or expired OTP", 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name: `${fname} ${lname}`,
                email,
                phone,
                password: hashedPassword,
                role: "USER",
            },
        });
        if (!newUser) {
            throw new AppError("Failed to create user", 500);
        }

        // Delete OTP from cache
        cache.del(`OTP_${email}`);

        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        // check user exists
        const existUser = await prisma.user.findUnique({ where: { email } });
        if (!existUser) {
            throw new AppError("User not exists", 400);
        }

        // password verification
        const isPasswordValid = await bcrypt.compare(password, existUser.password);

        if (!isPasswordValid) {
            throw new AppError("Invalid password", 400);
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: existUser.id, email: existUser.email },
            config.jwtSecret as string,
            { expiresIn: "7d" }
        );

        // Send token as HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: config.env === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    }


    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            throw new AppError("Email is required", 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError("No account found with this email", 404);
        }

        let otp = AuthController.generateOtp();

        const subject = "LeadFlow Forgot Password OTP Code";
        const body = `<h1>Your OTP Code is ${otp}.</h1> <p>This code is valid for 5 minutes only.</p>`;

        const emailRes: EmailResponse = await sendMail(email, subject, body);

        if (emailRes.success == false) {
            throw new AppError(`Failed to send OTP. Reason : ${emailRes.message}`, 502);
        }

        cache.set(`Forgot-Password_OTP_${email}`, otp, 300);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    }

    async resetPassword(req: Request, res: Response) {
        console.log("Reset Password Request Body:", req.body); // Debug log
        const { email, otp, password, confirmPassword } = req.body;

        if (!email || !otp || !password || !confirmPassword) {
            throw new AppError("All fields are required", 400);
        }

        if (password !== confirmPassword) {
            throw new AppError("Passwords do not match", 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError("No account found with this email", 404);
        }

        // Check OTP in cache
        const cachedOtp = cache.get<string>(`Forgot-Password_OTP_${email}`);
        if (!cachedOtp) {
            throw new AppError("OTP expired or invalid", 400);
        }

        if (cachedOtp !== otp) {
            throw new AppError("Invalid OTP", 400);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password in DB
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // Clear OTP from cache
        cache.del(`Forgot-Password_OTP_${email}`);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    }

}

export const authController = new AuthController();