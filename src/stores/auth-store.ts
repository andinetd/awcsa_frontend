import { mockUsers } from "@/lib/mock-data";
import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  // token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      // token: null,

      login: async (email, password) => {
        if (!email || !password) throw new Error("Missing credentials");

        const foundUser = mockUsers.find(
          (user) => user.email === email && password === "password123"
        );

        if (!foundUser) {
          throw new Error("Invalid email or password");
        }

        console.log(`logged user: ${JSON.stringify(foundUser)}`);

        set({ user: foundUser });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    { name: "auth-store" }
  )
);
