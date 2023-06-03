import express from "express";
// import customerModel from "models/customers.models";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "customers", data: {} });
});

export default router;
