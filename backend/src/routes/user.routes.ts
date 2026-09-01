import { Router } from "express";
import protectedRoute from "../middlewares/auth";
import { getAllUsers } from "../controller/userController";

const userRouter = Router();

userRouter.get("/", protectedRoute, getAllUsers);

export default userRouter;
