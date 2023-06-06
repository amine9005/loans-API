import express from "express";
import controller from "../controllers/users.controller";

const router = express.Router();

router.get("/", controller.getAllUsers);
router.post("/create", controller.createUser);
router.get("/byEmail/:email", controller.getUserByEmail);

export default router;
