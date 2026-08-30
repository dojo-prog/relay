import type { RemoveConversationMemberInput } from "@relay/shared";
import { useMutation } from "@tanstack/react-query";

import { removeMember } from "../socket/conversation.socket";

export const useRemoveMember = () => {
  return useMutation({
    mutationFn: (input: RemoveConversationMemberInput) => removeMember(input),
  });
};
