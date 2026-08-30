import { useMutation } from "@tanstack/react-query";

import { typingStart } from "../socket/typing.socket";

export const useTypingStart = () => {
  return useMutation({
    mutationFn: (conversationId: string) => typingStart(conversationId),
  });
};
