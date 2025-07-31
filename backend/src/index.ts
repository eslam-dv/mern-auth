import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import protect from "./middleware/protect";
import sessionRoutes from "./routes/session.routes";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

// check health
app.get("/", (_, res) => {
  res.status(200).json({ status: "healthy" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", protect, userRoutes);
app.use("/api/session", protect, sessionRoutes);

// error handler middleware
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} environment`);
  await connectDB();
});
