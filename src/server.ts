import app from "./app";
import mongoose from "mongoose";
import { config } from "./config/config";

const PORT = config.server.port;

mongoose.Promise = Promise;
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" }) //, {retryWrites:true,w:'majority'}
  .then(() => {
    console.log("Connected to Mongo DB successfully");
    app.listen(PORT, (): void => {
      console.log(`Server Running  at 👉 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Couldn't connect to Mongo DB: ", err);
    process.exit(1);
  });
