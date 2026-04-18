import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorMidlleware } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
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