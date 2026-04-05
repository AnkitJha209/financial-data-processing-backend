import express from "express";
import { verifyADMIN, verifyToken } from "../middlewares/auth.middleware";
import {
    createRecordSchema,
    updateRecordSchema,
} from "../schemas/record.schema";
import {
    createRecord,
    getRecordById,
    getRecords,
    safeDeleteRecord,
    updateRecord,
} from "../controllers/record.controller";
import { validate } from "../middlewares/validate";

export const recordRoutes = express.Router();

/**
 * @swagger
 * /api/records:
 *   get:
 *     tags: [Records]
 *     summary: Get paginated records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *       401:
 *         description: Unauthorized
 */
recordRoutes.get("/", verifyToken, getRecords);

/**
 * @swagger
 * /api/records:
 *   post:
 *     tags: [Records]
 *     summary: Create a record (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordRequest'
 *     responses:
 *       201:
 *         description: Record created successfully
 *       403:
 *         description: Forbidden
 */
recordRoutes.post(
    "/",
    verifyToken,
    verifyADMIN,
    validate(createRecordSchema),
    createRecord,
);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     tags: [Records]
 *     summary: Get a record by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record fetched successfully
 *       404:
 *         description: Record not found
 */
recordRoutes.get("/:id", verifyToken, getRecordById);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     tags: [Records]
 *     summary: Update a record (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/RecordRequest'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
recordRoutes.put(
    "/:id",
    verifyToken,
    verifyADMIN,
    validate(updateRecordSchema),
    updateRecord,
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     tags: [Records]
 *     summary: Soft delete a record (ADMIN)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Record not found
 */
recordRoutes.delete("/:id", verifyToken, verifyADMIN, safeDeleteRecord);
