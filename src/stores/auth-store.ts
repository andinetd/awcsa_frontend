import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/auth-service";

export type UserRole =
  | "super-admin"
  | "bureau-head"
  | "adoption"
  | "social-affairs"
  | "womens";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
          const response = await authService.login({ email, password });

          set({
            user: response.user,
            token: response.token,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Login failed",
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          set({
            user: null,
            token: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      },

      setLoading: (loading: boolean) => set({ loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        set({ loading: true });

        try {
          const response = await authService.getCurrentUser();
          set({
            user: response.user,
            loading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            loading: false,
            error: "Session expired",
            isAuthenticated: false,
          });
        }
      },

      refreshUser: async () => {
        try {
          const response = await authService.getCurrentUser();
          set({ user: response.user });
        } catch (error) {
          console.error("Failed to refresh user:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
