import express from "express";
import controller from "../controllers/orders.controller";
import verified from "../middleware/verifyJWT";

const router = express.Router();

router.post("/add", verified, controller.addOrder);
router.get("/", verified, controller.getAllOrders);
router.put("/update/:id", verified, controller.updateOrder);
router.delete("/delete/:id", verified, controller.deleteOrder);
router.get("/:id", verified, controller.getOrderById);
router.get(
  "/getByTotalPriceEqual/:totalPrice",
  verified,
  controller.getOrderByTotalPriceEqual
);
router.get(
  "/getByTotalPriceGreater/:totalPrice",
  verified,
  controller.getOrderByTotalPriceGreater
);

export default router;
