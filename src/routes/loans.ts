import express from "express";
// import loanModel from "models/loans.models";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "loans", data: {} });
});

export default router;
