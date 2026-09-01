import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import User from "../models/Users";

export type AuthRequest = Request & {
  userId?: string;
};

const protectedRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });

    req.userId = user._id.toString();

    next();
  } catch (error) {
    next(error);
  }
};

export default protectedRoute;
