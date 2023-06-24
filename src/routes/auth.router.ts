import express from "express";
import authController from "../controllers/auth.controller";
import loginLimiter from "../middleware/loginLimiter";

const router = express.Router();

router.post("/login", loginLimiter, authController.login);
router.post("/register", authController.registerUser);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
