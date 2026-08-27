import { Server, Socket } from "socket.io";

const registerTypingHandlers = (io: Server, socket: Socket) => {
  const { user } = socket;

  // =======================================
  // START
  // =======================================

  socket.on(
    "typing:start",
    ({ conversationId }: { conversationId: string }) => {
      const payload = {
        userId: user.id,
        username: user.username,
        conversationId,
        isTyping: true,
      };

      socket.to(`conversation:${conversationId}`).emit("typing:user", payload);
    },
  );

  // =======================================
  // STOP
  // =======================================

  socket.on("typing:stop", ({ conversationId }: { conversationId: string }) => {
    const payload = {
      userId: user.id,
      username: user.username,
      conversationId,
      isTyping: false,
    };

    socket.to(`conversation:${conversationId}`).emit("typing:user", payload);
  });
};

export default registerTypingHandlers;
