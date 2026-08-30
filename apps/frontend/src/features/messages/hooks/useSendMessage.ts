import type { CreateMessageInput } from "@relay/shared";
import { useMutation } from "@tanstack/react-query";

import { create } from "../socket/message.socket";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: (input: CreateMessageInput) => create(input),
  });
};
