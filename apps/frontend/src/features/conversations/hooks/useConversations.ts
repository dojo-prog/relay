import type { ConversationQuery, ConversationType } from "@relay/shared";
import { useInfiniteQuery } from "@tanstack/react-query";

import * as conversationApi from "../api/conversation.api";

export const useConversations = ({
  type,
  search,
  unread,
}: {
  type?: ConversationType;
  search?: string;
  unread?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ["conversations", { type, search, unread }],

    queryFn: ({ pageParam }) => {
      const params: ConversationQuery = {
        page: pageParam,
        limit: 10,
        type,
        search,
        unread,
      };

      return conversationApi.getConversations(params);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data?.pagination;

      if (page >= total_pages) return undefined;

      return page + 1;
    },
  });
};
