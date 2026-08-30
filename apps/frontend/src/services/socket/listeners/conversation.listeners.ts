import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { socket } from "../socket";
import type { ConversationWithRelations } from "@relay/shared";

export interface ConversationsPage {
  data: {
    conversations: ConversationWithRelations[];
    pagination: {
      page: number;
      total_pages: number;
    };
  };
}

export const registerConversationListeners = (queryClient: QueryClient) => {
  const handleCreated = (conversation: ConversationWithRelations) => {
    queryClient.setQueriesData<InfiniteData<ConversationsPage>>(
      {
        queryKey: ["conversations"],
      },
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page, index) => {
            if (index !== 0) return page;

            return {
              ...page,
              data: {
                ...page.data,
                conversations: [conversation, ...page.data.conversations],
              },
            };
          }),
        };
      },
    );
  };

  const handleUpdated = (conversation: ConversationWithRelations) => {
    queryClient.setQueriesData<InfiniteData<ConversationsPage>>(
      {
        queryKey: ["conversations"],
      },
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              conversations: page.data.conversations.map((c) =>
                c.id === conversation.id ? conversation : c,
              ),
            },
          })),
        };
      },
    );
  };

  const handleDeleted = (conversation: ConversationWithRelations) => {
    queryClient.setQueriesData<InfiniteData<ConversationsPage>>(
      {
        queryKey: ["conversations"],
      },
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            data: {
              ...page.data,
              conversations: page.data.conversations.filter(
                (c) => c.id !== conversation.id,
              ),
            },
          })),
        };
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
