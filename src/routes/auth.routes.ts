import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, refreshSchema, registerSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", validate(refreshSchema), logout);

export default router;