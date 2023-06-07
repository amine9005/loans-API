import express from "express";
import authController from "../controllers/auth.controller";
import loginLimiter from "../middleware/loginLimiter";

const router = express.Router();

router.get("/login", loginLimiter, authController.login);
router.post("/register", authController.registerUser);
router.get("/refresh");
router.post("/logout");

export default router;
