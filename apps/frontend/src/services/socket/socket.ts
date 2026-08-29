import { env } from "@/config/env";
import { io } from "socket.io-client";

export const socket = io(env.socketUrl, {
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});
