import express from "express";
import controller from "../controllers/products.controller";
import verified from "../middleware/verifyJWT";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", verified, controller.getProducts);
router.post("/add", verified, controller.addProduct);
router.post(
  "/picture",
  [verified, upload.single("picture")],
  controller.addPicture
);
router.post(
  "/pictures",
  [verified, upload.array("pictures")],
  controller.addPictures
);
router.get("/:id", verified, controller.getProductById);
router.delete("/delete/:id", verified, controller.deleteProduct);
router.put("/update/:id", verified, controller.updateProduct);
router.get("/getByName/:name", verified, controller.getProductByName);
router.get(
  "/getByPriceGreater/:price",
  verified,
  controller.getProductGreaterThan
);
router.get("getByPriceLower/:price", verified, controller.getProductLowerThan);

export default router;
