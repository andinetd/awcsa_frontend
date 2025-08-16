import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {  UserType, OrgType, JwtPayload, UserRole, PermissionOperation, JwtUserType, EmployeeJwtPayload, ClientJwtPayload } from "@/types/api/auth";



interface AuthState {
  user: JwtUserType | null;
  token: string | null;
  entity: EmployeeJwtPayload["entity"] | ClientJwtPayload['entity'] | null;
  auth: { permissions: string[]} | null;
  orgUnit: EmployeeJwtPayload['orgUnit'] | null;
  userRole: UserRole | null;
  userPermissions: string[] ;
  hydrated: boolean;
  setUser: (user: JwtUserType | null) => void;
  setToken: (token: string | null) => void;
  loadTokenFromCookie: () => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
 
    (set, get) => ({
      user: null,
      token: null,
      entity: null,
      auth: null,
      orgUnit: null,
      userRole: null,
      userPermissions: [],
      hydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          Cookies.set("wcasf_auth_token", token, {
            secure: true,
            sameSite: "strict",
            expires: 7,
            path: "/"
          })
          const decodedToken: JwtPayload = jwtDecode(token);
          if(decodedToken.user.accountType === "EMPLOYEE"){

            const employeeToken = decodedToken as EmployeeJwtPayload;
            set({
              token,
              user: employeeToken.user,
              entity: employeeToken.entity,
              auth: employeeToken.auth,
              orgUnit: employeeToken.orgUnit,
              userRole: employeeToken.entity.role as UserRole,
              userPermissions: employeeToken.auth.permissions,
             
            });
          }

          if(decodedToken.user.accountType === "CLIENT") {
            const clientToken = decodedToken as ClientJwtPayload;
            set({
                token,
              user: clientToken.user,
              entity: clientToken.entity,
              auth: clientToken.auth,
              orgUnit: null,
              userRole: null,
              userPermissions: clientToken.auth.permissions,
            })
          }
        }
      },

      loadTokenFromCookie: () => {
        const token = Cookies.get("wcasf_auth_token");
        if(token) {
          get().setToken(token);
        }
        set({hydrated: true});
      },

      logout: () => {
        Cookies.remove("wcasf_auth_token");
        set({
          user: null,
          token: null,
          entity: null,
          auth: null,
          orgUnit: null,
          userRole: null,
          userPermissions: [],
         });
      },

      hasRole: (role) => get().userRole === role,
      hasPermission: (permission) => get().userPermissions?.includes(permission) ?? false
    }),
 
);
