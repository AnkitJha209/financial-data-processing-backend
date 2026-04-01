import { Request, Response } from "express";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
// import { prisma } from "../prismaClient/client";
import { hash } from "zod";
import { hashPass } from "../utils/passwordEncryption";
import { prisma } from "../prismaClient/client";



export const register = async (req: Request, res: Response) => {
    try {
        const { email, name, password, role } = req.body;
        const user = await prisma.user.findUnique({ where: { email } })
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                hashPassword: await hashPass(password),
                role
            },
        });
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user: newUser },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
        });
    }
};

export const login = (req: Request<{}, {}, LoginInput>, res: Response) => {
    try {
        const { email, password } = req.body;
        // Data is already validated by Zod middleware
        console.log("Login attempt:", { email });

        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
        });
    }
};

export const me = (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: { user: "current user" },
    });
};
