import { ConversationQuery, ConversationWithRelations } from "@relay/shared";
import {
  CreateConversationParams,
  DeleteConversationParams,
  GetConversationParams,
  GetConversationsResult,
  GetLatestMessageParams,
  GetUnreadCountParams,
  LeaveConversationParams,
  MarkAsReadParams,
  UpdateConversationParams,
  UpdateConversationResult,
} from "../types/conversation.types";
import calculateTotalPages from "../utils/calculateTotalPages";
import AppError from "../utils/AppError";
import generateChanges from "../utils/generateChanges";
import pool from "../database/db";
import { Message } from "@relay/shared";

import * as conversationRepository from "../repositories/conversation.repository";
import * as conversationMemberRepository from "../repositories/conversation_member.repository";
import { ConversationMember } from "@relay/shared";

export const getUserConversations = async (
  userId: string,
  filters: ConversationQuery,
): Promise<GetConversationsResult> => {
  const { conversations, total } = await conversationRepository.find(
    userId,
    filters,
  );

  const { page, limit } = filters;

  return {
    conversations,
    pagination: {
      page,
      limit,
      total,
      total_pages: calculateTotalPages(total, limit),
    },
  };
};

export const createConversation = async (
  params: CreateConversationParams,
): Promise<ConversationWithRelations> => {
  const { userId, memberIds, ...rest } = params;

  if (rest.type === "direct" && memberIds?.length) {
    const existing = await conversationRepository.findDirectConversation(
      userId,
      memberIds[0],
    );

    if (existing) {
      throw new AppError(
        400,
        "This direct conversation with the user already exists",
      );
    }
  }

  const data = {
    ...rest,
    created_by: userId,
  };

  const client = await pool.connect();

  let conversationId: string;

  try {
    await client.query("BEGIN");

    // Create Conversation
    conversationId = await conversationRepository.add(data, client);

    // Add Creator as Member
    await conversationMemberRepository.add(
      {
        user_id: userId,
        conversation_id: conversationId,
      },
      client,
    );

    // Add Initial Members
    if (memberIds?.length && memberIds.length > 0) {
      for (const id of memberIds) {
        await conversationMemberRepository.add(
          {
            user_id: id,
            conversation_id: conversationId,
          },
          client,
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );
};

export const getConversationById = async (
  params: GetConversationParams,
): Promise<ConversationWithRelations> => {
  const { userId, conversationId } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  return conversation;
};

export const updateConversation = async (
  params: UpdateConversationParams,
): Promise<UpdateConversationResult> => {
  const { userId, conversationId, modified } = params;

  const conversation = await conversationRepository.findById(conversationId);

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  if (conversation.created_by !== userId) {
    throw new AppError(
      403,
      "Only the conversation creator can modify its details.",
    );
  }

  if (conversation.type !== "group") {
    throw new AppError(400, "Only group conversations can be modified");
  }

  const { old_values, new_values } = generateChanges(conversation, modified);

  const updated = await conversationRepository.update(
    userId,
    conversationId,
    new_values,
  );

  return {
    conversation: updated,
    old_values,
    new_values,
  };
};

export const deleteConversation = async (
  params: DeleteConversationParams,
): Promise<ConversationWithRelations> => {
  const { userId, conversationId } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  if (conversation.created_by.id !== userId) {
    throw new AppError(
      403,
      "Only the conversation creator can delete this conversation.",
    );
  }

  if (conversation.type !== "group") {
    throw new AppError(400, "Only group conversations can be deleted");
  }

  return conversation;
};

export const leaveConversation = async (
  params: LeaveConversationParams,
): Promise<ConversationWithRelations> => {
  const { userId, conversationId } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  await conversationMemberRepository.remove(conversationId, userId);

  return conversation;
};

export const getLatestMessage = async (
  params: GetLatestMessageParams,
): Promise<Message> => {
  const { userId, conversationId } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  return await conversationRepository.findLatestByConversation(conversationId);
};

export const getUnreadCount = async (
  params: GetUnreadCountParams,
): Promise<number> => {
  const { userId, conversationId } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  return await conversationRepository.getUnreadCount(conversationId, userId);
};

export const markAsRead = async (
  params: MarkAsReadParams,
): Promise<ConversationMember | void> => {
  const { userId, conversationId } = params;

  const conversation = await conversationRepository.findWithRelationsById(
    userId,
    conversationId,
  );

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const latestMessage =
    await conversationRepository.findLatestByConversation(conversationId);

  if (!latestMessage) return;

  const { sequence } = latestMessage;

  return await conversationRepository.markAsRead(
    conversationId,
    userId,
    sequence,
  );
};
