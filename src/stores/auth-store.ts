// import { mockUsers } from "@/lib/mock-data";
// import { User } from "@/types";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   setToken: () => void;
//   setUser: (user: User) => void;
//   // login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,

//       // login: async (email, password) => {
//       //   if (!email || !password) throw new Error("Missing credentials");

//       //   const foundUser = mockUsers.find(
//       //     (user) => user.email === email && password === "password123"
//       //   );

//       //   if (!foundUser) {
//       //     throw new Error("Invalid email or password");
//       //   }

//       //   console.log(`logged user: ${JSON.stringify(foundUser)}`);

//       //   set({ user: foundUser });
//       // },
//       setUser(user) => set({ user }),

//       setT

//       logout: () => {
//         set({ user: null });
//       },
//     }),
//     { name: "auth-store" }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { LoginResponseUser, OrgType } from "@/types/api/auth";

type JwtPayload = {
  sub: number;
  user: LoginResponseUser;
  entity?: { type: string; id: number; deputyBureau?: string };
  auth?: { permissions: string[] };
  iat: number;
  exp: number;
};

interface AuthState {
  user: LoginResponseUser | null;
  token: string | null;
  org?: OrgType;
  hydrated: boolean;
  setUser: (user: LoginResponseUser | null) => void;
  setToken: (token: string | null) => void;
  setOrg: (org: OrgType | undefined) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      org: undefined,
      hydrated: false,
      setUser: (user) => set({ user }),
      setOrg: (org) => set({ org }),
      setToken: (token) => {
        if (token) {
          const decodedToken = jwtDecode<JwtPayload>(token);
          set({
            token,
            user: decodedToken.user,

            org: decodedToken.entity
              ? {
                  unitId: decodedToken.entity.id,
                  unitType: decodedToken.entity.type,
                  deputyBureau: decodedToken.entity.deputyBureau ?? "",
                }
              : undefined,
          });
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-store", // key in localStorage
    }
  )
);
