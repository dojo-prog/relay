import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { socket } from "../socket";
import type {
  ConversationMember,
  ConversationWithRelations,
} from "@relay/shared";

export interface ConversationsPage {
  data: {
    conversations: ConversationWithRelations[];
    pagination: {
      page: number;
      total_pages: number;
    };
  };
}

export const registerConversationListeners = (
  queryClient: QueryClient,
  currentUserId: string,
) => {
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

  const handleHasRead = () => {
    queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });
  };

  const handleMemberAdded = (member: ConversationMember) => {
    queryClient.invalidateQueries({
      queryKey: ["members", member.conversation_id],
    });
  };

  const handleMemberRemoved = (member: ConversationMember) => {
    queryClient.invalidateQueries({
      queryKey: ["members", member.conversation_id],
    });

    if (member.user_id === currentUserId) {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  };

  socket.on("conversation:created", handleCreated);
  socket.on("conversation:updated", handleUpdated);
  socket.on("conversation:deleted", handleDeleted);
  socket.on("conversation:has_read", handleHasRead);
  socket.on("conversation:member_added", handleMemberAdded);
  socket.on("conversation:member_removed", handleMemberRemoved);

  return () => {
    socket.off("conversation:created", handleCreated);
    socket.off("conversation:updated", handleUpdated);
    socket.off("conversation:deleted", handleDeleted);
    socket.off("conversation:member_added", handleMemberAdded);
    socket.off("conversation:member_removed", handleMemberRemoved);
  };
};
