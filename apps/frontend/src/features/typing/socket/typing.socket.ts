import { socket } from "@/services/socket/socket";

export const typingStart = (conversationId: string) => {
  return new Promise((resolve) => {
    socket.emit("typing:start", { conversationId });

    resolve("success");
  });
};

export const typingStop = (conversationId: string) => {
  return new Promise((resolve) => {
    socket.emit("typing:stop", { conversationId });

    resolve("success");
  });
};
