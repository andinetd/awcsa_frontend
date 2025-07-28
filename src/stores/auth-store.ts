import { UserRole } from "@/hooks/useCurrentRole";
import { PermissionType } from "@/utils/permission";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: PermissionType[];
  org: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// mock user

const mock: User = {
  id: "123",
  email: "Shigido.email.com",
  // "accountType": "EMPLOYEE",
  // EMPLOYEE or CLIENT

  role: "bureau-head",
  permissions: [
    // these values are not what is in the DB; hasn't been inserted into the DB yet; but take the structure.
    "view_clients",
    "create_client",
    "update_client",
    "view_employees",
  ],
  org: [],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: mock,
      token: null,

      login: async (email, password) => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Login failed");

        const { token, user } = await res.json();
        set({ token, user });
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    { name: "auth-store" }
  )
);
