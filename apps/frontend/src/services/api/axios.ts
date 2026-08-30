import { env } from "@/config/env";
import axios from "axios";
import * as authApi from "@/features/auth/api/auth.api";
import useAuthStore from "@/stores/auth.store";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (AUTH_ENDPOINTS.some((url) => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= authApi.refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      await refreshPromise;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      useAuthStore.setState({ user: null });

      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
