import { Request, Response } from "express";
import { prisma } from "../prismaClient/client";

// GET /api/dashboard/summary - totals (income, expense, net)
export const getSummary = async (req: Request, res: Response) => {
    try {
        const records = await prisma.record.findMany({
            where: {
                isDeleted: false,
            },
        });

        const totalIncome = records
            .filter((r) => r.type === "INCOME")
            .reduce((sum, r) => sum + r.amount, 0);

        const totalExpense = records
            .filter((r) => r.type === "EXPENSE")
            .reduce((sum, r) => sum + r.amount, 0);

        const net = totalIncome - totalExpense;

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                net,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching summary",
        });
        return;
    }
};

export const getByCategory = async (req: Request, res: Response) => {
    try {
        const recordsByCategory = await prisma.record.findMany({
            where: {
                isDeleted: false,
            },
        });

        const categoryBreakdown: {
            [key: string]: {
                income: number;
                expense: number;
                total: number;
                count: number;
            };
        } = {};

        recordsByCategory.forEach((record) => {
            const category = record.category;

            if (!categoryBreakdown[category]) {
                categoryBreakdown[category] = {
                    income: 0,
                    expense: 0,
                    total: 0,
                    count: 0,
                };
            }

            if (record.type === "INCOME") {
                categoryBreakdown[category].income += record.amount;
            } else {
                categoryBreakdown[category].expense += record.amount;
            }

            categoryBreakdown[category].total =
                categoryBreakdown[category].income -
                categoryBreakdown[category].expense;
            categoryBreakdown[category].count += 1;
        });

        res.status(200).json({
            success: true,
            data: categoryBreakdown,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching category breakdown",
        });
        return;
    }
};

// GET /api/dashboard/trends - monthly/weekly trends
// Query params: ?period=month (default) or week
export const getTrends = async (req: Request, res: Response) => {
    try {
        const period = (req.query.period as string) || "month"; // 'week' or 'month'

        // Get records from the last 12 months/weeks
        const now = new Date();
        let startDate: Date;

        if (period === "week") {
            startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
        } else {
            startDate = new Date(
                now.getFullYear() - 1,
                now.getMonth(),
                now.getDate(),
            );
        }

        const records = await prisma.record.findMany({
            where: {
                isDeleted: false,
                date: {
                    gte: startDate,
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        const trends: {
            [key: string]: {
                income: number;
                expense: number;
                net: number;
            };
        } = {};

        records.forEach((record) => {
            let periodKey: string;

            if (period === "week") {
                const weekStart = new Date(record.date);
                weekStart.setDate(
                    weekStart.getDate() -
                        weekStart.getDay() +
                        (weekStart.getDay() === 0 ? -6 : 1),
                );
                periodKey = weekStart.toISOString().split("T")[0]; // YYYY-MM-DD format
            } else {
                // Get month in YYYY-MM format
                periodKey = record.date.toISOString().substring(0, 7);
            }

            if (!trends[periodKey]) {
                trends[periodKey] = {
                    income: 0,
                    expense: 0,
                    net: 0,
                };
            }

            if (record.type === "INCOME") {
                trends[periodKey].income += record.amount;
            } else {
                trends[periodKey].expense += record.amount;
            }

            trends[periodKey].net =
                trends[periodKey].income - trends[periodKey].expense;
        });

        res.status(200).json({
            success: true,
            period,
            data: trends,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching trends",
        });
        return;
    }
};

// GET /api/dashboard/recent - last N transactions
// Query params: ?limit=10 (default)
export const getRecent = async (req: Request, res: Response) => {
    try {
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Max 100 records

        const recentRecords = await prisma.record.findMany({
            where: {
                isDeleted: false,
            },
            orderBy: {
                date: "desc",
            },
            take: limit,
        });

        res.status(200).json({
            success: true,
            data: recentRecords,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching recent records",
        });
        return;
    }
};
