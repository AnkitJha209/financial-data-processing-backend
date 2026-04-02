import express from "express"
import { getUserById, getUsers, updateUserRole } from "../controllers/admin.controller";
import { validate } from "../middlewares/validate";
import { updateUserRoleSchema } from "../schemas/admin.schema";

export const adminRoutes = express.Router();

adminRoutes.get("/users", getUsers);

adminRoutes.get("/users/:id", getUserById);

adminRoutes.put("/users/:id/role", validate(updateUserRoleSchema), updateUserRole);