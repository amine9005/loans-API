import express from "express";
import verified from "../middleware/verifyJWT";
import controller from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/inventorySize", verified, controller.getInventorySize);
router.get("/ordersCount", verified, controller.getOrdersSize);
router.get("/salesData/:filter", verified, controller.getSalesData);
router.get("/inventoryData/:filter", verified, controller.getInventoryData);
router.get("/ordersData/:filter", verified, controller.getOrdersData);

export default router;
