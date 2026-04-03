import express from "express";
import { verifyANALYSTorADMIN, verifyToken } from "../middlewares/auth.middleware";
import {
    exportCategoryBreakdown,
    exportRecords,
    exportSummary,
} from "../controllers/export.controller";

export const exportRoutes = express.Router();

exportRoutes.get("/records", verifyToken, verifyANALYSTorADMIN, exportRecords);
exportRoutes.get("/summary", verifyToken, verifyANALYSTorADMIN, exportSummary);
exportRoutes.get("/category", verifyToken, verifyANALYSTorADMIN, exportCategoryBreakdown);
