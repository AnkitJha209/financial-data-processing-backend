import { Request, Response } from "express";
import { prisma } from "../prismaClient/client";

export const getUsers = async (req: Request, res: Response) => {
    try {
        let page = Number(req.query.page as string) || 1;
        let limit = Number(req.query.limit as string) || 10;

        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user",
        });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        const { role } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user role",
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        const softDeletedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                isDeleted: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },

        });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: softDeletedUser,
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting user",
        });
    }
};
