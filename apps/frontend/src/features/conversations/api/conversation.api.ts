import axiosInstance from "@/services/api/axios";
import type { ConversationMemberQuery, ConversationQuery } from "@relay/shared";

export const getConversations = async (params: ConversationQuery) => {
  const { data } = await axiosInstance.get("/v1/conversations", { params });

  return data;
};

export const getConversation = async (conversationId: string) => {
  const { data } = await axiosInstance.get(
    `/v1/conversations/${conversationId}`,
  );

  return data;
};

export const getConversationMembers = async (
  conversationId: string,
  params: ConversationMemberQuery,
) => {
  const { data } = await axiosInstance.get(
    `/v1/conversations/${conversationId}/members`,
    { params },
  );

  return data;
};
