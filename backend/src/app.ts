import express from "express";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middlewares/errorHandler";
import messageRouter from "./routes/message.routes";
import chatRouter from "./routes/chat.routes";

const app = express();

app.use(express.json());

app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chats", chatRouter);

// error handlers must come after all the routes and other middlewares so they can catch errors passed with next(err) or thrown inside async handlers.
app.use(errorHandler);

export default app;
