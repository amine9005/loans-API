import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions";

import indexRouter from "./routes/router";
import usersRouter from "./routes/users";
import customersRouter from "./routes/customers";
import loansRouter from "./routes/loans";
import invoicesRouter from "./routes/invoices";
import auditsRouter from "./routes/audits";
import paymentsRouter from "./routes/payments";
import settingsRouter from "./routes/settings";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/v1/loan_manager", indexRouter);
app.use("/api/v1/loan_manager/users", usersRouter);
app.use("/api/v1/loan_manager/customers", customersRouter);
app.use("/api/v1/loan_manager/loans", loansRouter);
app.use("/api/v1/loan_manager/invoices", invoicesRouter);
app.use("/api/v1/loan_manager/audits", auditsRouter);
app.use("/api/v1/loan_manager/payments", paymentsRouter);
app.use("/api/v1/loan_manager/settings", settingsRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    error: "404 Route Not Found",
  });
});

export default app;
