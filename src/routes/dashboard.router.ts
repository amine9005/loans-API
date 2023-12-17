import express from "express";
import verified from "../middleware/verifyJWT";
import controller from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/inventorySize", verified, controller.getInventorySize);
router.get("/ordersCount", verified, controller.getOrdersSize);

export default router;
