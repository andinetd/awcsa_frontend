import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import {  UserType, OrgType, JwtPayload, UserRole, PermissionOperation } from "@/types/api/auth";



interface AuthState {
  user: UserType | null;
  token: JwtPayload | null;
  org?: OrgType;
  userRole: UserRole | null;
  userPermissions: PermissionOperation[] | null;
  hydrated: boolean;
  setUser: (user: UserType | null) => void;
  setToken: (token: JwtPayload | null) => void;
  setOrg: (org: OrgType | undefined) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: PermissionOperation) => boolean;
}

export const useAuthStore = create<AuthState>()(
 
    (set, get) => ({
      user: null,
      token: null,
      org: undefined,
      userRole: null,
      userPermissions: [],

      hydrated: false,
      setUser: (user) => set({ user }),
      setOrg: (org) => set({ org }),
      setToken: (token) => {
        if (token) {
          const decodedToken: JwtPayload = jwtDecode(token.toString());
          set({
            token,
            user: decodedToken.user,
            userRole: decodedToken.user.role,
            userPermissions: decodedToken.user.permissions,
            org: decodedToken.org
              ? {
                  unitId: decodedToken.org.unitId,
                  unitType: decodedToken.org.unitType,
                  deputyBureau: decodedToken.org.deputyBureau  
                }
              : undefined,
          });
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      hasRole: (role) => get().user?.role === role,
      hasPermission: (permission) => get().user?.permissions?.includes(permission) ?? false
    }),
 
);
