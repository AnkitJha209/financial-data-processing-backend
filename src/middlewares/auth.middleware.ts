import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "No token provided",
            });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'defualt_secret_key') as any;
        (req as any).user = {
            id: decoded.userId,
            role: decoded.role
        };
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying token",
        });
        return;
    }
}

export const verifyADMIN = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        if (user.role !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "Forbidden",
            });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying admin privileges",
        });
        return;
    }
}

export const verifyANALYSTorADMIN = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        if (user.role !== "ANALYST" && user.role !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "Forbidden",
            });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: "Error verifying analyst or admin privileges",
        });
        return;
    }
}

export const verifyVIEWER = (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        if (user.role !== "VIEWER" && user.role !== "ANALYST" && user.role !== "ADMIN") {
            res.status(403).json({
                success: false,
                message: "Forbidden",
            });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying viewer privileges",
        });
        return;
    }
}
