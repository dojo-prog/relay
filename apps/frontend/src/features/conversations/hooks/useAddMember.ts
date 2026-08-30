import type { AddConversationMemberInput } from "@relay/shared";
import { useMutation } from "@tanstack/react-query";

import { addMember } from "../socket/conversation.socket";

export const useAddMember = () => {
  return useMutation({
    mutationFn: (input: AddConversationMemberInput) => addMember(input),
  });
};
