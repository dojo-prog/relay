import { ConversationMemberQuery } from "@relay/shared";
import AppError from "../utils/AppError";
import {
  AddConversationMemberData,
  AddConversationMemberParams,
  GetAllMemberIds,
  GetConversationMembersResult,
  RemoveConversationMemberParams,
} from "../types/conversation_member.types";
import calculateTotalPages from "../utils/calculateTotalPages";

import * as conversationMemberRepository from "../repositories/conversation_member.repository";
import * as conversationRepository from "../repositories/conversation.repository";
import { ConversationMemberWithRelations } from "@relay/shared";

export const getConversationMembers = async (
  conversationId: string,
  userId: string,
  filters: ConversationMemberQuery,
): Promise<GetConversationMembersResult> => {
  const isMember = await conversationMemberRepository.findById(
    conversationId,
    userId,
  );

  if (!isMember) {
    throw new AppError(
      403,
      "You cannot access this conversation's members as you are not a member",
    );
  }

  const { conversation_members, total } =
    await conversationMemberRepository.find(conversationId, filters);

  const { page, limit } = filters;

  return {
    conversation_members,
    pagination: {
      page,
      limit,
      total,
      total_pages: calculateTotalPages(total, limit),
    },
  };
};

export const getAllConversationMemberIds = async (
  params: GetAllMemberIds,
): Promise<string[]> => {
  const { conversationId, userId } = params;

  const isMember = await conversationMemberRepository.findById(
    conversationId,
    userId,
  );

  if (!isMember) {
    throw new AppError(404, "Conversation not found");
  }

  const members = await conversationMemberRepository.findAllIds(conversationId);

  return members.map((member) => member.user_id);
};

export const addMember = async (
  params: AddConversationMemberParams,
): Promise<ConversationMemberWithRelations> => {
  const { userId, conversationId, memberId } = params;

  const conversation = await conversationRepository.findById(conversationId);

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new AppError(409, "Cannot add a member to a non-group conversation");
  }

  if (conversation.created_by !== userId) {
    throw new AppError(
      403,
      "Only the group creator can add members to this conversation",
    );
  }

  const existing = await conversationMemberRepository.findWithRelationsById(
    conversationId,
    memberId,
  );

  if (existing) {
    throw new AppError(
      400,
      `User ${existing.user.username} is already a member`,
    );
  }

  const data: AddConversationMemberData = {
    conversation_id: conversationId,
    user_id: memberId,
  };

  return await conversationMemberRepository.add(data);
};

export const removeMember = async (
  params: RemoveConversationMemberParams,
): Promise<ConversationMemberWithRelations> => {
  const { userId, conversationId, memberId } = params;

  const conversation = await conversationRepository.findById(conversationId);

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new AppError(
      409,
      "Cannot remove a member to a non-group conversation",
    );
  }

  if (conversation.created_by !== userId) {
    throw new AppError(
      403,
      "Only the group creator can remove members to this conversation",
    );
  }

  const member = await conversationMemberRepository.findWithRelationsById(
    conversationId,
    memberId,
  );

  if (!member) {
    throw new AppError(404, "Conversation member not found");
  }

  await conversationMemberRepository.remove(conversationId, memberId);

  return member;
};
