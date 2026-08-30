import type { QueryClient } from "@tanstack/react-query";
import { socket } from "../socket";

interface TypingPayload {
  userId: string;
  username: string;
  conversationId: string;
  isTyping: string;
}

export const registerTypingListener = (queryClient: QueryClient) => {
  const handleTyping = (payload: TypingPayload) => {
    const { isTyping, conversationId, username } = payload;

    if (isTyping) {
      queryClient.setQueryData<string[]>(["typing", conversationId], (old) => {
        if (!old) return [username];

        const existing = old.find((u) => u === username);

        if (existing) return old;

        return [...old, username];
      });
    } else {
      queryClient.setQueryData<string[]>(["typing", conversationId], (old) => {
        if (!old) return old;

        return old.filter((u) => u !== username);
      });
    }
  };

  socket.on("typing:user", handleTyping);

  return () => {
    socket.off("typing:user", handleTyping);
  };
};
