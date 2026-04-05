import express from "express";
import {
    deleteUser,
    getUserById,
    getUsers,
    updateUserRole,
} from "../controllers/admin.controller";
import { validate } from "../middlewares/validate";
import { updateUserRoleSchema } from "../schemas/admin.schema";
import { verifyADMIN, verifyToken } from "../middlewares/auth.middleware";

export const adminRoutes = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (ADMIN)
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
 *         description: Users fetched successfully
 */
adminRoutes.get("/users", verifyToken, verifyADMIN, getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get user by id (ADMIN)
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
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 */
adminRoutes.get("/users/:id", verifyToken, verifyADMIN, getUserById);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     tags: [Admin]
 *     summary: Update user role (ADMIN)
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
 *             $ref: '#/components/schemas/UpdateUserRoleRequest'
 *     responses:
 *       200:
 *         description: User role updated successfully
 */
adminRoutes.put(
    "/users/:id/role",
    verifyToken,
    verifyADMIN,
    validate(updateUserRoleSchema),
    updateUserRole,
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Soft delete user (ADMIN)
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
 *         description: User deleted successfully
 */
adminRoutes.delete("/users/:id", verifyToken, verifyADMIN, deleteUser);
