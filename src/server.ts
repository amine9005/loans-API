import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5200;

app.listen(PORT, (): void => {
  console.log(`Server Running  at 👉 http://localhost:${PORT}`);
});
