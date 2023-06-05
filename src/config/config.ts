import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const DATABASE_NAME = process.env.DATABASE_NAME || "testing";

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.oowuzud.mongodb.net/${DATABASE_NAME}`;

const API_URL = process.env.API_URL || "api/v0/";

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 8000;

export const config = {
  mongo: {
    url: MONGO_URI,
  },
  server: {
    port: SERVER_PORT,
  },
  api: {
    url: API_URL,
  },
};
