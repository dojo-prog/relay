import { useMutation } from "@tanstack/react-query";

import { typingStop } from "../socket/typing.socket";

export const useTypingStop = () => {
  return useMutation({
    mutationFn: (conversationId: string) => typingStop(conversationId),
  });
};
