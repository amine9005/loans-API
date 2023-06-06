import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { config } from "./config";

export const connectToMemoryDB = async () => {
  let url: string;
  if (config.memory.url === "TRUE") {
    const mongoServer = await MongoMemoryServer.create();

    url = mongoServer.getUri();
  } else {
    url = config.memory.url;
  }

  await mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to memory server");
    })
    .catch((err) => {
      console.log("Failed to connect to memory server", err);
    });
};

export const disconnectFromMemoryDB = async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
};
