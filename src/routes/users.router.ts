import express from "express";
import controller from "../controllers/users.controller";

const router = express.Router();

router.get("/", controller.readUser);
router.post("/create", controller.createUser);

export default router;
