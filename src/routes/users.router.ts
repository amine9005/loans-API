import express from "express";
import controller from "../controllers/users.controller";
// import { isAuthenticated } from "../middleware";

const router = express.Router();

router.get("/", controller.getAllUsers);
router.post("/create", controller.createUser);
router.get("/byEmail/:email", controller.getUserByEmail);
router.get("/byId/:id", controller.getUserById);

export default router;
