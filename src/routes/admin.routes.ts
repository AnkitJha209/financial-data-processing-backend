import express from "express"
import { deleteUser, getUserById, getUsers, updateUserRole } from "../controllers/admin.controller";
import { validate } from "../middlewares/validate";
import { updateUserRoleSchema } from "../schemas/admin.schema";
import { verifyADMIN, verifyToken } from "../middlewares/auth.middleware";

export const adminRoutes = express.Router();

adminRoutes.get("/users", verifyToken, verifyADMIN, getUsers);
adminRoutes.get("/users/:id", verifyToken, verifyADMIN, getUserById);
adminRoutes.put("/users/:id/role", verifyToken, verifyADMIN, validate(updateUserRoleSchema), updateUserRole);
adminRoutes.delete("/users/:id", verifyToken, verifyADMIN, deleteUser);