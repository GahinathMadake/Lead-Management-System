import { Request, Response } from "express";

class AuthController{
    constructor() {
    }

    async login(req:Request, res:Response){
        const { email, password } = req.body;

    }
}

export const authController = new AuthController();