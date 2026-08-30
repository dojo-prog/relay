import { socket } from "@/services/socket/socket";
import type {
  AddConversationMemberInput,
  Conversation,
  ConversationMember,
  ConversationWithRelations,
  CreateConversationInput,
  DeleteConversationInput,
  MarkConversationAsReadInput,
  RemoveConversationMemberInput,
  UpdateConversationInput,
} from "@relay/shared";

interface Response<T extends object> {
  success: boolean;
  message?: string;
  data: T;
}

export const create = (
  input: CreateConversationInput,
): Promise<ConversationWithRelations> => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "conversation:create",
      input,
      (
        response: Response<{
          conversation: ConversationWithRelations;
        }>,
      ) => {
        if (!response.success) {
          reject(
            new Error(response.message ?? "Failed to create conversation"),
          );
          return;
        }

        const conversation = response.data?.conversation;

        if (!conversation) {
          reject(new Error("Server did not return a conversation"));
          return;
        }

        resolve(conversation);
      },
    );
  });
};

export const update = (input: UpdateConversationInput) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "conversation:update",
      input,
      (repsonse: Response<{ conversation: ConversationWithRelations }>) => {
        if (!repsonse.success) {
          reject(
            new Error(repsonse.message ?? "Failed to update conversation"),
          );

          return;
        }

        const conversation = repsonse.data?.conversation;

        if (!conversation) {
          reject(new Error("Server did not return the updated conversation"));
        }

        resolve(conversation);
      },
    );
  });
};

export const remove = (input: DeleteConversationInput) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "conversation:delete",
      input,
      (response: Response<{ conversation: ConversationWithRelations }>) => {
        if (!response.success) {
          reject(
            new Error(response.message ?? "Failed to delete conversation"),
          );
        }

        const conversation = response.data?.conversation;

        if (!conversation) {
          reject(new Error("Server did not return the deleted conversation"));
        }

        resolve(conversation);
      },
    );
  });
};

export const read = (input: MarkConversationAsReadInput) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "conversation:read",
      input,
      (response: Response<Conversation>) => {
        if (!response.success) {
          reject(
            new Error(
              response.message ??
                "Failed to mark conversation messages as read",
            ),
          );
        }

        resolve("success");
      },
    );
  });
};

export const addMember = (input: AddConversationMemberInput) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "conversation:add_member",
      input,
      (response: Response<{ conversation_member: ConversationMember }>) => {
        if (!response.success) {
          reject(response.message ?? "Failed to add new member");
        }

        const newMember = response.data?.conversation_member;

        if (!newMember) {
          reject("Server did not return the new member details");
        }

        resolve(newMember);
      },
    );
  });
};

export const removeMember = (input: RemoveConversationMemberInput) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "conversation:remove_member",
      input,
      (response: Response<{ conversation_member: ConversationMember }>) => {
        if (!response.success) {
          reject(
            response.message ?? "Failed to remove member from the conversation",
          );
        }

        const removedMember = response.data?.conversation_member;

        if (!removedMember) {
          reject("Server did not return the new member details");
        }

        resolve(removedMember);
      },
    );
  });
};
