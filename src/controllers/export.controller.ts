import { Request, Response } from "express";
import { Parser } from "json2csv";
import { prisma } from "../prismaClient/client";

const parseLimit = (
    value: string | undefined,
    fallback: number,
    max: number,
) => {
    const parsed = Number.parseInt(value || "", 10);

    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }

    return Math.min(parsed, max);
};

// GET /api/export/records -> all financial records (with filters)
export const exportRecords = async (req: Request, res: Response) => {
    try {
        const type = req.query.type as "INCOME" | "EXPENSE" | undefined;
        const category = req.query.category as string | undefined;
        const fromDate = req.query.fromDate as string | undefined;
        const toDate = req.query.toDate as string | undefined;
        const limit = parseLimit(
            req.query.limit as string | undefined,
            5000,
            10000,
        );

        const records = await prisma.record.findMany({
            where: {
                isDeleted: false,
                ...(type ? { type } : {}),
                ...(category ? { category: category as any } : {}),
                ...(fromDate || toDate
                    ? {
                          date: {
                              ...(fromDate ? { gte: new Date(fromDate) } : {}),
                              ...(toDate ? { lte: new Date(toDate) } : {}),
                          },
                      }
                    : {}),
            },
            orderBy: { date: "desc" },
            take: limit,
        });

        const csvRows = records.map((record) => ({
            id: record.id,
            date: record.date.toISOString(),
            type: record.type,
            category: record.category,
            amount: record.amount,
            description: record.description || "",
            createdAt: record.createdAt.toISOString(),
            updatedAt: record.updatedAt.toISOString(),
        }));

        const parser = new Parser({
            fields: [
                "id",
                "date",
                "type",
                "category",
                "amount",
                "description",
                "createdAt",
                "updatedAt",
            ],
        });

        const csv = parser.parse(csvRows);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="records.csv"',
        );
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error exporting records",
        });
    }
};

// GET /api/export/summary -> dashboard summary as CSV
export const exportSummary = async (req: Request, res: Response) => {
    try {
        const fromDate = req.query.fromDate as string | undefined;
        const toDate = req.query.toDate as string | undefined;

        const records = await prisma.record.findMany({
            where: {
                isDeleted: false,
                ...(fromDate || toDate
                    ? {
                          date: {
                              ...(fromDate ? { gte: new Date(fromDate) } : {}),
                              ...(toDate ? { lte: new Date(toDate) } : {}),
                          },
                      }
                    : {}),
            },
        });

        const totalIncome = records
            .filter((record) => record.type === "INCOME")
            .reduce((sum, record) => sum + record.amount, 0);

        const totalExpense = records
            .filter((record) => record.type === "EXPENSE")
            .reduce((sum, record) => sum + record.amount, 0);

        const row = {
            totalIncome,
            totalExpense,
            net: totalIncome - totalExpense,
            totalTransactions: records.length,
            fromDate: fromDate || "",
            toDate: toDate || "",
        };

        const parser = new Parser({
            fields: [
                "totalIncome",
                "totalExpense",
                "net",
                "totalTransactions",
                "fromDate",
                "toDate",
            ],
        });

        const csv = parser.parse([row]);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="summary.csv"',
        );
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error exporting summary",
        });
    }
};

// GET /api/export/category -> category-wise breakdown
export const exportCategoryBreakdown = async (req: Request, res: Response) => {
    try {
        const fromDate = req.query.fromDate as string | undefined;
        const toDate = req.query.toDate as string | undefined;

        const records = await prisma.record.findMany({
            where: {
                isDeleted: false,
                ...(fromDate || toDate
                    ? {
                          date: {
                              ...(fromDate ? { gte: new Date(fromDate) } : {}),
                              ...(toDate ? { lte: new Date(toDate) } : {}),
                          },
                      }
                    : {}),
            },
        });

        const categoryMap: Record<
            string,
            {
                category: string;
                income: number;
                expense: number;
                net: number;
                transactionCount: number;
            }
        > = {};

        for (const record of records) {
            const category = record.category;

            if (!categoryMap[category]) {
                categoryMap[category] = {
                    category,
                    income: 0,
                    expense: 0,
                    net: 0,
                    transactionCount: 0,
                };
            }

            if (record.type === "INCOME") {
                categoryMap[category].income += record.amount;
            } else {
                categoryMap[category].expense += record.amount;
            }

            categoryMap[category].net =
                categoryMap[category].income - categoryMap[category].expense;
            categoryMap[category].transactionCount += 1;
        }

        const rows = Object.values(categoryMap).sort((a, b) =>
            a.category.localeCompare(b.category),
        );
        const parser = new Parser({
            fields: [
                "category",
                "income",
                "expense",
                "net",
                "transactionCount",
            ],
        });

        const csv = parser.parse(rows);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="category-breakdown.csv"',
        );
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error exporting category breakdown",
        });
    }
};
