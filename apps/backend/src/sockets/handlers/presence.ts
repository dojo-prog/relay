import { Server, Socket } from "socket.io";

const handleUserOnline = (io: Server, socket: Socket) => {
  const { user } = socket;

  socket.emit("user:online", {
    userId: user.id,
    username: user.username,
  });
};

const handleUserOffline = async (io: Server, socket: Socket) => {
  const { user } = socket;

  const sockets = await io.in(`user:${user.id}`).fetchSockets();

  if (sockets.length === 0) {
    io.emit("user:offline", { userId: user.id, username: user.username });
  }
};

export { handleUserOnline, handleUserOffline };
