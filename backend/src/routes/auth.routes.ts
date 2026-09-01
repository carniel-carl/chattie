import { Router } from "express";
import { getMe } from "../controller/authController";

const authRouter = Router();

authRouter.get("/me", getMe);

export default authRouter;
