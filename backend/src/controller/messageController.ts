import type { NextFunction, Request, Response } from "express";
import Message from "../models/Messages";
import type { AuthRequest } from "../middlewares/auth";
import Chat from "../models/Chats";

const getMessages = async (
  req: AuthRequest<{ chatId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, participants: userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 }); // oldest first
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export { getMessages };
