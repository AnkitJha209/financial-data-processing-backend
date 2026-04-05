import { Request, Response } from "express";
import { prisma } from "../prismaClient/client";

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

        type CategoryStats = {
            income: number;
            expense: number;
            total: number;
            count: number;
        };

        const categoryBreakdown: Record<string, CategoryStats> = {};

        for (const record of recordsByCategory) {
            const category = record.category;
            const stats =
                categoryBreakdown[category] ||
                (categoryBreakdown[category] = {
                    income: 0,
                    expense: 0,
                    total: 0,
                    count: 0,
                });

            if (record.type === "INCOME") {
                stats.income += record.amount;
                stats.total += record.amount;
            } else {
                stats.expense += record.amount;
                stats.total -= record.amount;
            }

            stats.count += 1;
        }

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

export const getTrends = async (req: Request, res: Response) => {
    try {
        const period = req.query.period === "week" ? "week" : "month";
        const now = new Date();
        const startDate =
            period === "week"
                ? new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000)
                : new Date(
                      now.getFullYear() - 1,
                      now.getMonth(),
                      now.getDate(),
                  );

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

        type TrendStats = {
            income: number;
            expense: number;
            net: number;
        };

        const getPeriodKey = (date: Date): string => {
            if (period === "week") {
                const weekStart = new Date(date);
                weekStart.setDate(
                    weekStart.getDate() -
                        weekStart.getDay() +
                        (weekStart.getDay() === 0 ? -6 : 1),
                );
                return weekStart.toISOString().split("T")[0];
            }

            return date.toISOString().substring(0, 7);
        };

        const trends: Record<string, TrendStats> = {};

        for (const record of records) {
            const periodKey = getPeriodKey(record.date);
            const stats =
                trends[periodKey] ||
                (trends[periodKey] = {
                    income: 0,
                    expense: 0,
                    net: 0,
                });

            if (record.type === "INCOME") {
                stats.income += record.amount;
                stats.net += record.amount;
            } else {
                stats.expense += record.amount;
                stats.net -= record.amount;
            }
        }

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

export const getRecent = async (req: Request, res: Response) => {
    try {
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

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
