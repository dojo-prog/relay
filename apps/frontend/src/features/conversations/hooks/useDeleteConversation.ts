import { useMutation } from "@tanstack/react-query";
import { remove } from "../socket/conversation.socket";
import type { DeleteConversationInput } from "@relay/shared";

export const useDeleteConversation = () => {
  return useMutation({
    mutationFn: (input: DeleteConversationInput) => remove(input),
  });
};
