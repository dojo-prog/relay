import { useQuery } from "@tanstack/react-query";

import * as conversationApi from "../api/conversation.api";

export const useConversation = (conversationId?: string) => {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => {
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }

      return conversationApi.getConversation(conversationId);
    },

    enabled: !!conversationId,
  });
};
