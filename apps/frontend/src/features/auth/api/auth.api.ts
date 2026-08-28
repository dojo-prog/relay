import axiosInstance from "@/services/api/axios";
import type { LoginBody, RegisterBody } from "@relay/shared";

export const register = async (body: RegisterBody) => {
  const { data } = await axiosInstance.post("/v1/auth/register", body);
  return data;
};

export const login = async (body: LoginBody) => {
  const { data } = await axiosInstance.post("/v1/auth/login", body);
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post("/v1/auth/logout");
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await axiosInstance.get("/v1/auth/me");
  return data;
};

export const refreshAccessToken = async () => {
  await axiosInstance.post("/v1/auth/refresh");
};
