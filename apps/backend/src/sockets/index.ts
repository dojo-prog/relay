import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import socketAuthMiddleware from "./middlewares/socket.auth.middleware";
import handleConnection from "./connection";
import ENV from "../config/env";

const initializeSocket = (httpServer: HttpServer) => {
  // SocketIO Server Instance
  const allowableOrigins = [ENV.CLIENT_URL, ENV.DEV_CLIENT_URL];

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowableOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
  });

  // Socket Auth Middleware
  io.use(socketAuthMiddleware);

  // Connection Listener
  io.on("connection", (socket) => {
    handleConnection(io, socket);
  });

  return io;
};

export default initializeSocket;
