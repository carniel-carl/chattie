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
      // sort on the timestamp, not the lastMessage ObjectId
      .sort({ lastMessageAt: -1 });

    // Format the chats to only include the other participant and the last message
    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (participant) => participant._id.toString() !== userId,
      );

      return {
        _id: chat._id,
        // the client renders a single "participant" (the other person), so send
        // that rather than an array it would have to unwrap
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
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

    // same shape as getChats: only the other person
    const otherParticipant = chat.participants.find(
      (participant) => participant._id.toString() !== userId,
    );

    res.json({
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

export { getChats, createOrGetChat };
