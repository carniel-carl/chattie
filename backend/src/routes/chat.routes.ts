import { Router } from "express";
import protectedRoute from "../middlewares/auth";
import { createOrGetChat, getChats } from "../controller/chatController";

const chatRouter = Router();

chatRouter.use(protectedRoute);

chatRouter.get("/", getChats);
chatRouter.post("/with/:participantId", createOrGetChat);

export default chatRouter;
