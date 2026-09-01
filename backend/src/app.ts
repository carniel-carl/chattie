import express from "express";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(express.json());

app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

export default app;
