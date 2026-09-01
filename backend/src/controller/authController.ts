import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import User from "../models/Users";
import { clerkClient, getAuth } from "@clerk/express";

const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const authCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    let user = await User.findOne({ clerkId });

    if (!user) {
      //get user info from clerk and save to db
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const name = clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim()
        : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0]; // Use first name and last name if available, otherwise use the part of the email before the @ symbol
      const email = clerkUser?.emailAddresses[0]?.emailAddress;
      const avatar = clerkUser?.imageUrl;

      user = new User({
        clerkId,
        name,
        email,
        avatar,
      });

      await user.save();
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
};

export { getMe, authCallback };
