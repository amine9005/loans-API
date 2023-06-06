import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectToMemoryDB = async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose
    .connect("http://localhost:27017")
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
