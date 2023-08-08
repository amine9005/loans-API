import express from "express";
import controller from "../controllers/orders.controller";
import verified from "../middleware/verifyJWT";

const router = express.Router();

router.post("/add", verified, controller.addOrder);

export default router;
