import express from "express";
import controller from "../controllers/products.controller";
import verified from "../middleware/verifyJWT";

const router = express.Router();

router.get("/", verified, controller.getProducts);
router.post("/add", verified, controller.addProduct);
router.get("/:id", verified, controller.getProductById);
router.delete("/delete/:id", verified, controller.deleteProduct);

export default router;
