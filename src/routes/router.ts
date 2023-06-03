import express from "express";

const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  res.status(200).json({ message: "api is ready and waiting!", data: {} });
});

export default indexRouter;
