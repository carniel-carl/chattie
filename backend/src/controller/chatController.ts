import type { NextFunction, Request, Response } from "express";
import Chat from "../models/Chats";
import type { AuthRequest } from "../middlewares/auth";

const getChats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = _req.userId;
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessage: -1 });

    // Format the chats to only include the other participant and the last message
    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (participant) => participant._id.toString() !== userId,
      );

      return {
        _id: chat._id,
        participants: otherParticipant ? [otherParticipant] : [],
        lastMessage: chat.lastMessage,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });
    res.json(formattedChats);
  } catch (error) {
    next(error);
  }
};

const createOrGetChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;
    const { participantId } = req.params;

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Check if a chat already exists between the two users
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");

    if (!chat) {
      // If no chat exists, create a new one
      chat = new Chat({
        participants: [userId, participantId],
      });
      await chat.save();
      chat = await chat.populate("participants", "name email avatar");
    }

    res.json({
      _id: chat._id,
      participants: chat.participants,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export { getChats, createOrGetChat };
