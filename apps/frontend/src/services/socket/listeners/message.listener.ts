import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { MessageWithRelations } from "@relay/shared";

import { socket } from "../socket";

type MessagesPage = {
  data: {
    messages: MessageWithRelations[];
    pagination: {
      page: number;
      total_pages: number;
    };
  };
};

export const registerMessageListener = (queryClient: QueryClient) => {
  const handleNew = ({
    message,
  }: {
    message: MessageWithRelations;
    unread_count: number;
  }) => {
    // Add message to the currently cached conversation
    queryClient.setQueryData<InfiniteData<MessagesPage>>(
      ["messages", message.conversation_id],
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
                messages: [...page.data.messages, message],
              },
            };
          }),
        };
      },
    );

    queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });
  };

  const handleUpdated = (message: MessageWithRelations) => {
    queryClient.setQueryData<InfiniteData<MessagesPage>>(
      ["messages", message.conversation_id],
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              messages: page.data.messages.map((m) =>
                m.id === message.id ? message : m,
              ),
            },
          })),
        };
      },
    );
  };

  const handleDeleted = ({
    id,
    conversation_id,
  }: {
    id: string;
    conversation_id: string;
  }) => {
    queryClient.setQueryData<InfiniteData<MessagesPage>>(
      ["messages", conversation_id],
      (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              messages: page.data.messages.filter((m) => m.id !== id),
            },
          })),
        };
      },
    );
  };

  socket.on("message:new", handleNew);
  socket.on("message:updated", handleUpdated);
  socket.on("message:deleted", handleDeleted);

  return () => {
    socket.off("message:new", handleNew);
    socket.off("message:updated", handleUpdated);
    socket.off("message:deleted", handleDeleted);
  };
};
