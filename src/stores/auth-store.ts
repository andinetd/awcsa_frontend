// // stores/useAuthStore.ts
// import { UserRole } from "@/hooks/useCurrentRole";
// import { create } from "zustand";

// export interface AuthUser {
//   id: number;
//   email: string;
//   accountType: "EMPLOYEE" | "CLIENT";
//   role: string;
//   permissions: string[];
//   org: {
//     unitId: number;
//     unitType: string;
//     deputyBureau: string;
//   };
// }

export const roleMap: Record<string, UserRole> = {
  SUPER_ADMIN: "super-admin",
  BUREAU_MANAGER: "bureau-head",
  ADOPTION_MANAGER: "adoption",
  SOCIAL_AFFAIRS_OFFICER: "social-affairs",
  WOMEN_AFFAIRS_OFFICER: "womens",
  EDIR_ADMIN: "edir",
  ELDERLY_DISABLED_MANAGER: "elderly-disabled",
};

import { UserRole } from "@/hooks/useCurrentRole";
import { PermissionType } from "@/utils/permission";
// interface AuthState {
//   user: AuthUser | null;
//   loading: boolean;
//   login: (user: AuthUser) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   loading: false,
//   login: (user) => set({ user }),
//   logout: () => set({ user: null }),
// }));

// stores/useAuthStore.ts
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

// Organizational hierarchy
//   "org": {
//     "unitId": 5,
//     "unitType": "BUREAU",
//     "deputyBureau": "CHILDREN_AFFAIRS"
//   }

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
