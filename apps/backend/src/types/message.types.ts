import { Message, MessageWithRelations } from "../schemas/messages";
import { PaginationResult, UpdateResult } from "./common";

// =======================================
// SERVICE PARAMS
// =======================================

export interface CreateMessageParams {
  userId: string;
  conversationId: string;
  content: string;
}

export interface UpdateMessageParams {
  userId: string;
  conversationId: string;
  messageId: string;
  modified: Partial<Message>;
}

export interface DeleteMessageParams {
  userId: string;
  conversationId: string;
  messageId: string;
}

// =======================================
// REPOSITORY DATA
// =======================================

export interface CreateMessageData {
  conversation_id: string;
  sender_id: string;
  content: string;
}

// =======================================
// RESULT
// =======================================

export interface GetConversationMessagesResult extends PaginationResult {
  messages: MessageWithRelations[];
}

export interface UpdateMessageResult extends UpdateResult<Message> {
  message: MessageWithRelations;
}
