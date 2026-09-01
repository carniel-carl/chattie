import mongoose, { Schema, model } from "mongoose";

export interface IChat {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// indexes for faster queries
chatSchema.index({ participants: 1, updatedAt: -1 }); // newest one first

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
