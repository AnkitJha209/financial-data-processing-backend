import express from "express"
import { verifyADMIN, verifyToken } from "../middlewares/auth.middleware";
import { createRecordSchema, updateRecordSchema } from "../schemas/record.schema";
import { createRecord, getRecordById, getRecords, safeDeleteRecord, updateRecord } from "../controllers/record.controller";
import { validate } from "../middlewares/validate";

export const recordRoutes = express.Router();

recordRoutes.get("/", verifyToken, getRecords);
recordRoutes.post("/", verifyToken, verifyADMIN,validate(createRecordSchema), createRecord);
recordRoutes.get("/:id", verifyToken, getRecordById);
recordRoutes.put("/:id", verifyToken, verifyADMIN, validate(updateRecordSchema), updateRecord);
recordRoutes.delete("/:id", verifyToken, verifyADMIN, safeDeleteRecord);