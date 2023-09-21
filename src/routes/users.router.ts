import express from "express";
import controller from "../controllers/users.controller";
import verified from "../middleware/verifyJWT";

const router = express.Router();

router.get("/", verified, controller.getAllUsers);
router.get("/:id", verified, controller.getUserById);
router.get("/emails/:email", verified, controller.getUserByEmail);
router.put("/update/:id", verified, controller.updateUser);

export default router;
