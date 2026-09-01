import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import User from "../models/Users";

const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export { getAllUsers };
