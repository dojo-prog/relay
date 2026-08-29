import type { QueryClient } from "@tanstack/react-query";
import { socket } from "../socket";
import type { ConversationWithRelations } from "@relay/shared";

export const registerConversationListeners = (queryClient: QueryClient) => {
  const handleCreated = (conversation: ConversationWithRelations) => {
    queryClient.setQueryData<ConversationWithRelations[]>(
      ["conversations"],
      (old) => {
        if (!old) return [conversation];

        const existing = old.some((c) => c.id === conversation.id);

        if (existing) return old;

        return [conversation, ...old];
      },
    );
  };

  const handleUpdated = (conversation: ConversationWithRelations) => {
    queryClient.setQueryData<ConversationWithRelations[]>(
      ["conversations"],
      (old) => {
        if (!old) return old;

        return old.map((c) => (c.id === conversation.id ? conversation : c));
      },
    );
  };

  const handleDeleted = (conversation: ConversationWithRelations) => {
    queryClient.setQueryData<ConversationWithRelations[]>(
      ["conversations"],
      (old) => {
        if (!old) return old;

        return old.filter((c) => c.id !== conversation.id);
      },
    );
  };

  socket.on("conversation:created", handleCreated);
  socket.on("conversation:updated", handleUpdated);
  socket.on("conversation:deleted", handleDeleted);

  return () => {
    socket.off("conversation:created", handleCreated);
    socket.off("conversation:updated", handleUpdated);
    socket.off("conversation:deleted", handleDeleted);
  };
};
