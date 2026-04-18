import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorMidlleware } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://task-manager-frontend-nextjs.netlify.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true
  })
);
app.use(helmet());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api", routes);
app.use(errorMidlleware);

export default app;