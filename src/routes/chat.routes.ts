import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { chatQuestionSchema } from "../schemas/chat.schema";
import { chatWithRecords } from "../controllers/chat.controller";

export const chatRoutes = express.Router();

chatRoutes.post(
    "/records",
    verifyToken,
    validate(chatQuestionSchema),
    chatWithRecords,
);
