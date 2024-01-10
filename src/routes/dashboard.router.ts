import express from "express";
import verified from "../middleware/verifyJWT";
import controller from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/inventorySize", verified, controller.getInventorySize);
router.get("/ordersCount", verified, controller.getOrdersSize);
router.get("/salesData/:filter", verified, controller.getSalesData);

export default router;
