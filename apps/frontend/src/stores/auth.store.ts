import type { LoginBody, RegisterBody, UserPublic } from "@relay/shared";
import { create } from "zustand";

import * as authApi from "../features/auth/api/auth.api";

interface AuthState {
  user: UserPublic | null;

  loading: boolean;
  checkingAuth: boolean;

  checkAuth: () => Promise<void>;
  register: (values: RegisterBody) => Promise<unknown>;
  login: (values: LoginBody) => Promise<unknown>;
  logout: () => Promise<unknown>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,

  loading: false,
  checkingAuth: true,

  checkAuth: async () => {
    try {
      const { data } = await authApi.fetchCurrentUser();

      set({ user: data.user });
    } catch {
      set({ user: null });
    } finally {
      set({
        checkingAuth: false,
      });
    }
  },

  register: async (values) => {
    set({ loading: true });

    try {
      const { data } = await authApi.register(values);

      set({ user: data.user });

      return data;
    } finally {
      set({ loading: false });
    }
  },

  login: async (values) => {
    set({ loading: true });

    try {
      const { data } = await authApi.login(values);

      set({ user: data.user });

      return data;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      const { data } = await authApi.logout();

      set({ user: null });

      return data;
    } catch (error) {
      throw error;
    }
  },
}));

export default useAuthStore;
