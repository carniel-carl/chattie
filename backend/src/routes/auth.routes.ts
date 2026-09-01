import { Router } from "express";
import { authCallback, getMe } from "../controller/authController";
import protectedRoute from "../middlewares/auth";

const authRouter = Router();

authRouter.get("/me", protectedRoute, getMe);
authRouter.post("/callback", authCallback);

export default authRouter;
