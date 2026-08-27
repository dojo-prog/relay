import http from "http";
import checkDbConn from "./database/check";
import app from "./app";
import ENV from "./config/env";
import "./database/init";
import initializeSocket from "./sockets";

const startServer = async () => {
  try {
    await checkDbConn();

    const server = http.createServer(app);

    server.on("error", (err) => {
      console.error("Server encountered an error:", err);
      process.exit(1);
    });

    const io = initializeSocket(server);

    server.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
