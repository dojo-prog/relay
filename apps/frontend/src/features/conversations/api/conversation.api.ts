import axiosInstance from "@/services/api/axios";
import type { ConversationQuery } from "@relay/shared";

export const getConversations = async (params: ConversationQuery) => {
  const { data } = await axiosInstance.get("/v1/conversations", { params });

  return data;
};
