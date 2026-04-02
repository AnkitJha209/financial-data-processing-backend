import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { hashPass } from "../utils/passwordEncryption";
import { prisma } from "../prismaClient/client";
import jwt from "jsonwebtoken"



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

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userExist = await prisma.user.findUnique({ where: { email } });
        if(!userExist){
            res.status(400).json({
                success: false,
                message: "User does not exist",
            });
            return;
        }

        if(userExist.isDeleted){
            res.status(400).json({
                success: false,
                message: "User account is deleted. Contact admin to restore."
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, userExist.hashPassword)

        if(!isPasswordValid){
            res.status(400).json({
                success: false,
                message: "Invalid password",
            });
            return;
        }

        const token = jwt.sign({
            userId: userExist.id,
            role: userExist.role
        }, process.env.JWT_SECRET_KEY || 'default_secret_key', { expiresIn: "1h" })

        res.cookie("token", token, { httpOnly: true }).status(200).json({
            success: true,
            message: "Login successful",
            data: { token },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
        });
    }
};

export const me = async (req: Request, res: Response) => {
    try {
        const {id} = (req as any).user;
        if(!id){
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const userData = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true } });
        res.status(200).json({
            success: true,
            message: "User data retrieved successfully",
            data: { user: userData },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving user data",
        });
        return;
    }
};
