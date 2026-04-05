import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
    getSummary,
    getByCategory,
    getTrends,
    getRecent,
} from "../controllers/dashboard.controller";

export const dashboardRoutes = express.Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get income, expense, and net summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary fetched successfully
 */

dashboardRoutes.get("/summary", verifyToken, getSummary);

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get category-wise income and expense breakdown
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown fetched successfully
 */
dashboardRoutes.get("/by-category", verifyToken, getByCategory);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get monthly or weekly trends
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, week]
 *           default: month
 *     responses:
 *       200:
 *         description: Trends fetched successfully
 */
dashboardRoutes.get("/trends", verifyToken, getTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent records fetched successfully
 */
dashboardRoutes.get("/recent", verifyToken, getRecent);
