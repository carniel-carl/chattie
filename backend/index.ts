import app from "./src/app";
import authRouter from "./src/routes/auth.routes";
import userRouter from "./src/routes/user.routes";

const PORT = process.env.PORT || 8080;

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
