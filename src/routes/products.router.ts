import express from "express";
import controller from "../controllers/products.controller";
import verified from "../middleware/verifyJWT";
import upload from "../middleware/upload";
const router = express.Router();

router.get("/", verified, controller.getProducts);
router.post(
  "/add",
  [verified, upload.single("thumbnail")],
  controller.addProduct
);
router.get("/:id", verified, controller.getProductById);
router.delete("/delete/:id", verified, controller.deleteProduct);
router.put("/update/:id", verified, controller.updateProduct);

export default router;
