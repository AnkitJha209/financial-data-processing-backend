import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
    getSummary,
    getByCategory,
    getTrends,
    getRecent,
} from "../controllers/dashboard.controller";

export const dashboardRoutes = express.Router();


dashboardRoutes.get("/summary", verifyToken, getSummary);
dashboardRoutes.get("/by-category", verifyToken, getByCategory);
dashboardRoutes.get("/trends", verifyToken, getTrends);
dashboardRoutes.get("/recent", verifyToken, getRecent);
