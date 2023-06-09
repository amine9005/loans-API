import allowedOrigins from "./allowedOrigins";

const corsOptions = {
  origin: (
    origin: string,
    callback: (error: Error, allowed?: boolean) => void
  ) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "authorization"],
};

export default corsOptions;
