import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { chatQuestionSchema } from "../schemas/chat.schema";
import { chatWithRecords } from "../controllers/chat.controller";

export const chatRoutes = express.Router();

/**
 * @swagger
 * /api/chat/records:
 *   post:
 *     tags: [Chat]
 *     summary: Ask finance questions and get AI-generated answer from records
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatQuestionRequest'
 *     responses:
 *       200:
 *         description: Chat answer generated
 *       400:
 *         description: Blocked or invalid query request
 */
chatRoutes.post(
    "/records",
    verifyToken,
    validate(chatQuestionSchema),
    chatWithRecords,
);
