import { Request, Response } from "express";
import { prisma } from "../prismaClient/client";


export const createRecord = async (req: Request, res: Response) => {
    try {
        const { amount, type, description, date } = req.body;
        const userId = (req as any).user.id;

        const newRecord = await prisma.record.create({
            data: {
                amount,
                type,
                description,
                date: new Date(date),
                userId,
            },
        });

        res.status(201).json({
            success: true,
            message: "Record created successfully",
            data: newRecord,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating record",
        });
        return;
    }
};

export const updateRecord = async (req: Request, res: Response) => {
    try {
        const recordId = req.params.id as string;
        const { amount, type, description, date } = req.body;
        const userId = (req as any).user.id;

        const existingRecord = await prisma.record.findUnique({
            where: { id: recordId },
        });

        if (!existingRecord) {
            res.status(404).json({
                success: false,
                message: "Record not found",
            });
            return;
        }

        if (existingRecord.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You can only update your own records",
            });
            return;
        }

        const dataToUpdate: {
            amount?: number;
            type?: "INCOME" | "EXPENSE";
            description?: string;
            date?: Date;
        } = {};

        if (amount !== undefined) dataToUpdate.amount = amount;
        if (type !== undefined) dataToUpdate.type = type;
        if (description !== undefined) dataToUpdate.description = description;
        if (date !== undefined) dataToUpdate.date = new Date(date);

        const updatedRecord = await prisma.record.update({
            where: { id: recordId },
            data: dataToUpdate,
        });

        res.status(200).json({
            success: true,
            message: "Record updated successfully",
            data: updatedRecord,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating record",
        });
        return;
    }
};

export const safeDeleteRecord = async (req: Request, res: Response) => {
    try {
        const recordId = req.params.id as string;
        const userId = (req as any).user.id;

        const existingRecord = await prisma.record.findUnique({
            where: { id: recordId },
        });

        if (!existingRecord) {
            res.status(404).json({
                success: false,
                message: "Record not found",
            });
            return;
        }

        if (existingRecord.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "Forbidden: You can only delete your own records",
            });
            return;
        }

        await prisma.record.update({
            where: { id: recordId },
            data: { isDeleted: true },
        });

        res.status(200).json({
            success: true,
            message: "Record deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting record",
        });
        return;
    }
};


// ----------- get records for a user with pagination and filtering -----------
// ----------- one more thing to add category in record model and filter by category as well -----------
