import type { Request, Response } from "express";

const getMe = async (_req: Request, res: Response) => {
  res.send("Auth route is working!");
};

export { getMe };
