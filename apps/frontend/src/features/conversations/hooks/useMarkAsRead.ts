import { useMutation } from "@tanstack/react-query";

import { read } from "../socket/conversation.socket";

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: (conversationId: string) => read({ conversationId }),
  });
};
