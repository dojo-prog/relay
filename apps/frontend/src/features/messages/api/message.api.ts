import axiosInstance from "@/services/api/axios";
import type { MessageQuery } from "@relay/shared";

export const getMessages = async (
  conversationId: string,
  params: MessageQuery,
) => {
  const { data } = await axiosInstance.get(
    `/v1/conversations/${conversationId}/messages`,
    { params },
  );

  return data;
};
