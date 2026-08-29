import type { UpdateConversationInput } from "@relay/shared";
import { useMutation } from "@tanstack/react-query";

import { update } from "../socket/conversation.socket";

export const useUpdateConversation = () => {
  return useMutation({
    mutationFn: (input: UpdateConversationInput) => update(input),
  });
};
