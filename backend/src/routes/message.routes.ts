import { Router } from "express";
import { getMessages } from "../controller/messageController";

const messageRouter = Router();

messageRouter.get("/chat/:chatId", getMessages);

export default messageRouter;
