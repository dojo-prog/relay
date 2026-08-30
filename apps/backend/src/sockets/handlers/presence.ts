import { UserPublic } from "@relay/shared";
import { Server, Socket } from "socket.io";

type RemoteSocketWithUser = Awaited<
  ReturnType<Server["fetchSockets"]>
>[number] & {
  user: UserPublic;
};

const handleUserOnline = async (io: Server, socket: Socket) => {
  const { user } = socket;

  const sockets = (await io.fetchSockets()) as RemoteSocketWithUser[];

  const onlineUsers = sockets.map((s) => s.user.id);

  socket.emit("presence:initial", onlineUsers);

  socket.broadcast.emit("user:online", user.id);
};

const handleUserOffline = async (io: Server, socket: Socket) => {
  const { user } = socket;

  const sockets = await io.in(`user:${user.id}`).fetchSockets();

  if (sockets.length === 0) {
    io.emit("user:offline", user.id);
  }
};

export { handleUserOnline, handleUserOffline };
