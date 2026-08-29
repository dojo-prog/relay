import { useInfiniteQuery } from "@tanstack/react-query";

import * as conversationApi from "../api/message.api";

export const useMessages = (conversationId?: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],

    queryFn: ({ pageParam }) => {
      if (!conversationId) {
        throw new Error("Conversation ID is required ");
      }

      const params = {
        page: pageParam,
        limit: 10,
      };

      return conversationApi.getMessages(conversationId, params);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data?.pagination;

      if (page >= total_pages) return undefined;

      return page + 1;
    },

    enabled: !!conversationId,
  });
};
