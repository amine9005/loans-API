import express, { Application } from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import { config } from "./config/config";

import indexRouter from "./routes/router";
import authRouter from "./routes/auth.router";
import usersRouter from "./routes/users.router";

import cookieParser from "cookie-parser";

function createServer() {
  const app: Application = express();

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.use(config.api.url, indexRouter);
  app.use(config.api.url + "/users", usersRouter);
  app.use(config.api.url + "/auth", authRouter);

  app.use("*", (req, res) => {
    res.status(404).json({
      error: "404 Route Not Found",
    });
  });

  return app;
}

export default createServer;
