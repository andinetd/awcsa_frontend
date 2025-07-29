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
  // token: string | null;
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

const mockUsers: User[] = [
  {
    id: "1",
    email: "user1@gmail.com",
    role: "bureau-head",
    permissions: [
      "view_clients",
      "create_client",
      "update_client",
      "view_employees",
    ],
    org: [],
  },
  {
    id: "2",
    email: "user2@gmail.com",
    role: "social-affairs",
    permissions: ["view_clients"],
    org: [],
  },
  {
    id: "3",
    email: "user3@gmail.com",
    role: "adoption",
    permissions: ["view_clients", "create_client"],
    org: [],
  },
  {
    id: "4",
    email: "user4@gmail.com",
    role: "edir",
    permissions: [
      "view_clients",
      "view_employees",
      "create_client",
      "update_client",
    ],
    org: [],
  },
  {
    id: "5",
    email: "user5@gmail.com",
    role: "elderly-disabled",
    permissions: ["view_clients"],
    org: [],
  },
  {
    id: "6",
    email: "user6@gmail.com",
    role: "womens",
    permissions: ["view_clients"],
    org: [],
  },
  {
    id: "7",
    email: "user7@gmail.com",
    role: "super-admin",
    permissions: ["view_clients"],
    org: [],
  },
];

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
