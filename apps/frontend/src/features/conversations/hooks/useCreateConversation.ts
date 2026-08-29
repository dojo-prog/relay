import type { CreateConversationInput } from "@relay/shared";
import { useMutation } from "@tanstack/react-query";

import { create } from "../socket/conversation.socket";

export const useCreateConversation = () => {
  return useMutation({
    mutationFn: (input: CreateConversationInput) => create(input),
  });
};
