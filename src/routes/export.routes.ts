import express from "express";
import {
    verifyANALYSTorADMIN,
    verifyToken,
} from "../middlewares/auth.middleware";
import {
    exportCategoryBreakdown,
    exportRecords,
    exportSummary,
} from "../controllers/export.controller";

export const exportRoutes = express.Router();

/**
 * @swagger
 * /api/export/records:
 *   get:
 *     tags: [Export]
 *     summary: Export filtered records as CSV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-04-01
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-04-30
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 5000
 *           maximum: 10000
 *     responses:
 *       200:
 *         description: CSV file generated
 */
exportRoutes.get("/records", verifyToken, verifyANALYSTorADMIN, exportRecords);

/**
 * @swagger
 * /api/export/summary:
 *   get:
 *     tags: [Export]
 *     summary: Export summary as CSV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: CSV file generated
 */
exportRoutes.get("/summary", verifyToken, verifyANALYSTorADMIN, exportSummary);

/**
 * @swagger
 * /api/export/category:
 *   get:
 *     tags: [Export]
 *     summary: Export category-wise breakdown as CSV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: CSV file generated
 */
exportRoutes.get(
    "/category",
    verifyToken,
    verifyANALYSTorADMIN,
    exportCategoryBreakdown,
);
