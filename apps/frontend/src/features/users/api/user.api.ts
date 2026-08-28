import axiosInstance from "@/services/api/axios";
import type { UserQuery } from "@relay/shared";

export const fetchUsers = async (params: UserQuery) => {
  const { data } = await axiosInstance.get("/v1/users", { params });

  return data;
};
