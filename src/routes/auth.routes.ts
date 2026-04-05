import express from "express";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { register, login, me } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

export const authRoutes = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed or user already exists
 */
authRoutes.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user and receive JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or user does not exist
 */
authRoutes.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
authRoutes.get("/me", verifyToken, me);
