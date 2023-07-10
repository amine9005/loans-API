import express from "express";
import controller from "../controllers/products.controller";
import verified from "../middleware/verifyJWT";

const router = express.Router();

router.post("/add", verified, controller.addProduct);

export default router;
