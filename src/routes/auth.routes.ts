import express from "express";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import {register, login, me} from "../controllers/auth.controller";

const router = express.Router();

// POST /api/auth/register - with validation
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login - with validation
router.post("/login", validate(loginSchema), login);

// GET /api/auth/me - no validation needed
router.get("/me", me);

export default router;
