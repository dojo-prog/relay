import axiosInstance from "@/services/api/axios";
import type { NotificationQuery } from "@relay/shared";

export const getAllNotifications = async (params: NotificationQuery) => {
  const { data } = await axiosInstance.get("/v1/notifications", { params });

  return data;
};
