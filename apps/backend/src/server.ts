import http from "http";
import checkDbConn from "./database/check";
import app from "./app";
import ENV from "./config/env";
import "./database/init";
import initializeSocket from "./sockets";
import pool from "./database/db";

const startServer = async () => {
  try {
    await checkDbConn();

    const server = http.createServer(app);

    server.on("error", (err) => {
      console.error("Server encountered an error:", err);
      process.exit(1);
    });

    initializeSocket(server);

    server.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });

    const shutdown = (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("Server closed");

        try {
          await pool.end();

          console.log("DB pool closed");

          process.exit(0);
        } catch (error) {
          console.error("Error on graceful shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
