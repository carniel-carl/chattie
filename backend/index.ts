import app from "./src/app";
import { createServer } from "http";
import connectDb from "./src/config/database";
import { initializeSocket } from "./src/utils/socket";

const PORT = process.env.PORT || 8080;

const httpServer = createServer(app);

initializeSocket(httpServer);

connectDb()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
