import { QueryClient, useMutation } from "@tanstack/react-query";

import * as conversationApi from "../api/conversation.api";

export const useLeaveConversation = (
  conversationId: string,
  queryClient: QueryClient,
) => {
  return useMutation({
    mutationFn: () => conversationApi.leaveConversation(conversationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
