import type { QueryClient } from "@tanstack/react-query";
import { socket } from "../socket";

export const registerPresenceListener = (queryClient: QueryClient) => {
  const handleInitial = (onlineUsers: string[]) => {
    queryClient.setQueryData<string[]>(["presence"], () => {
      return onlineUsers;
    });
  };

  const handleUserOnline = (userId: string) => {
    queryClient.setQueryData<string[]>(["presence"], (old) => {
      if (!old) return [userId];

      return [...old, userId];
    });
  };

  const handleUserOffline = (userId: string) => {
    queryClient.setQueryData<string[]>(["presence"], (old) => {
      if (!old) return old;

      return old.filter((id) => id !== userId);
    });
  };

  socket.on("presence:initial", handleInitial);
  socket.on("user:online", handleUserOnline);
  socket.on("user:offline", handleUserOffline);

  return () => {
    socket.off("user:online", handleUserOnline);
    socket.off("user:offline", handleUserOffline);
  };
};
