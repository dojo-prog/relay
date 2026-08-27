import { MessageQuery, MessageWithRelations } from "../schemas/messages";
import AppError from "../utils/AppError";

import * as messageRepository from "../repositories/message.repository";
import * as conversationRepository from "../repositories/conversation.repository";
import {
  CreateMessageParams,
  DeleteMessageParams,
  GetConversationMessagesResult,
  UpdateMessageParams,
  UpdateMessageResult,
} from "../types/message.types";
import calculateTotalPages from "../utils/calculateTotalPages";
import generateChanges from "../utils/generateChanges";

export const getConversationMessages = async (
  userId: string,
  conversationId: string,
  filters: MessageQuery,
): Promise<GetConversationMessagesResult> => {
  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const { messages, total } = await messageRepository.find(
    conversationId,
    filters,
  );

  const { page, limit } = filters;

  return {
    messages,
    pagination: {
      page,
      limit,
      total,
      total_pages: calculateTotalPages(total, limit),
    },
  };
};

export const sendMessage = async (
  params: CreateMessageParams,
): Promise<MessageWithRelations> => {
  const { userId, conversationId, content } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const data = {
    conversation_id: conversationId,
    sender_id: userId,
    content,
  };

  return await messageRepository.add(data);
};

export const updateMessage = async (
  params: UpdateMessageParams,
): Promise<UpdateMessageResult> => {
  const { userId, conversationId, messageId, modified } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const message = await messageRepository.findById(conversationId, messageId);

  if (!message) {
    throw new AppError(404, "Message not found");
  }

  const { old_values, new_values } = generateChanges(message, modified);

  const updated = await messageRepository.update(
    conversationId,
    messageId,
    new_values,
  );

  return {
    message: updated,
    old_values,
    new_values,
  };
};

export const deleteMessage = async (params: DeleteMessageParams) => {
  const { userId, conversationId, messageId } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const message = await messageRepository.findById(conversationId, messageId);

  if (!message) {
    throw new AppError(404, "Message not found");
  }

  return await messageRepository.remove(conversationId, messageId);
};
