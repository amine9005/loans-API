import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const DATABASE_NAME = process.env.DATABASE_NAME || "testing";

const MONGO_URI = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.oowuzud.mongodb.net/${DATABASE_NAME}`;

const API_URL = process.env.API_URL || "/api/v1/inventory_manager";

const MEMORY_DATABASE =
  process.env.MEMORY_DATABASE ||
  "mongodb://localhost:27017?retryWrites=true&w=majority";

const UPDATE_SECRET = process.env.UPDATE_SECRET || "NEED AN UPDATE SECRET";

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
  memory: {
    url: MEMORY_DATABASE,
  },
  secret: {
    update: UPDATE_SECRET,
  },
};
