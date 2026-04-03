import express from "express";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import {register, login, me} from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

export const authRoutes = express.Router();

authRoutes.post("/register", validate(registerSchema), register);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.get("/me", verifyToken, me);

