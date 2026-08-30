import { useInfiniteQuery } from "@tanstack/react-query";

import * as conversationApi from "../api/conversation.api";

export const useConversationMembers = (
  conversationId: string,
  search?: string,
  limit = 10,
) => {
  return useInfiniteQuery({
    queryKey: ["members", conversationId, { search }],
    queryFn: ({ pageParam }) => {
      return conversationApi.getConversationMembers(conversationId, {
        page: pageParam,
        limit,
        search,
      });
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data?.pagination;

      if (page >= total_pages) return undefined;

      return page + 1;
    },
  });
};
