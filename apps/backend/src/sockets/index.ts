import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import socketAuthMiddleware from "./middlewares/socket.auth.middleware";
import handleConnection from "./connection";

const initializeSocket = (httpServer: HttpServer) => {
  // SocketIO Server Instance
  const io = new Server(httpServer, { cors: { origin: "*" } });

  // Socket Auth Middleware
  io.use(socketAuthMiddleware);

  // Connection Listener
  io.on("connection", (socket) => {
    handleConnection(io, socket);
  });

  return io;
};

export default initializeSocket;
