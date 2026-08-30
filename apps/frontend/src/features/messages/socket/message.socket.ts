import { socket } from "@/services/socket/socket";
import type { CreateMessageInput, MessageWithRelations } from "@relay/shared";

interface Response<T extends object> {
  success: boolean;
  message?: string;
  data: T;
}

export const create = (input: CreateMessageInput) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "message:send",
      input,
      (response: Response<{ message: MessageWithRelations }>) => {
        if (!response.success) {
          reject(new Error(response.message ?? "Failed to send message"));
        }

        const message = response.data?.message;

        if (!message) {
          reject(new Error("Server did not return a message"));
        }

        resolve(message);
      },
    );
  });
};
