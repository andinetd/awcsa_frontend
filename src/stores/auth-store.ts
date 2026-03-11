import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {
  JwtPayload,
  UserRole,
  JwtUserType,
  EmployeeJwtPayload,
  ClientJwtPayload,
} from "@/types/api/auth";

interface AuthState {
  user: JwtUserType | null;
  token: string | null;
  entity: EmployeeJwtPayload["entity"] | ClientJwtPayload["entity"] | null;
  auth: { permissions: string[] } | null;
  orgUnit: EmployeeJwtPayload["orgUnit"] | null;
  userRole: UserRole | null;
  userPermissions: string[];
  directorateId: number | null;
  teamId: number | null;
  department: string | null;
  hydrated: boolean;
  setUser: (user: JwtUserType | null) => void;
  setToken: (token: string | null) => void;
  loadTokenFromCookie: () => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      entity: null,
      auth: null,
      orgUnit: null,
      userRole: null,
      userPermissions: [],
      directorateId: null,
      teamId: null,
      department: null,
      hydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          try {
            Cookies.set("wcasf_auth_token", token, {
              secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === "true",
              sameSite: "strict",
              expires: 1,
              path: "/",
            });

            const decodedToken: JwtPayload = jwtDecode(token);
            const { user, entity, auth, iat, exp } = decodedToken;

            // Common state updates
            const newState: Partial<AuthState> = {
              token,
              user,
              auth,
              userPermissions: auth?.permissions || [],
              hydrated: true,
            };

            if (user.accountType === "EMPLOYEE") {
              const employeeToken = decodedToken as EmployeeJwtPayload;
              newState.entity = employeeToken.entity;
              newState.orgUnit = employeeToken.orgUnit || null;
              newState.userRole = employeeToken.entity.role as UserRole;
              newState.directorateId = employeeToken.directorateId ?? null;
              newState.teamId = employeeToken.teamId ?? null;
              newState.department = employeeToken.department ?? null;
            } else if (
              user.accountType === "CHILD_CARE_FACLITY" ||
              user.accountType === "CHILD_CARE_FACILITY"
            ) {
              const cfToken = decodedToken as any; // Handle flexible schema for CF
              newState.entity = cfToken.entity || null;
              newState.orgUnit = null;
              newState.userRole = (cfToken.entity?.role as UserRole) || null;
            } else if (user.accountType === "CLIENT") {
              const clientToken = decodedToken as ClientJwtPayload;
              newState.entity = clientToken.entity;
              newState.orgUnit = null;
              newState.userRole = null;
            }

            set(newState);
          } catch (error) {
            console.error("Failed to decode or set token:", error);
            get().logout();
          }
        }
      },

      loadTokenFromCookie: () => {
        const token = Cookies.get("wcasf_auth_token");
        if (token) {
          try {
            const decoded: JwtPayload = jwtDecode(token);
            const isExpired = decoded.exp
              ? decoded.exp * 1000 < Date.now()
              : false;

            if (isExpired) {
              get().logout();
            } else {
              get().setToken(token);
            }
          } catch (e) {
            console.error("Failed to load token from cookie:", e);
            get().logout();
          }
        }
        set({ hydrated: true });
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
          directorateId: null,
          teamId: null,
          department: null,
          hydrated: true,
        });
      },

      hasRole: (role) => get().userRole === role,
      hasPermission: (permission) =>
        get().userPermissions?.includes(permission) ?? false,
    }),
    {
      name: "auth-store", // key in localStorage
    },
  ),
);
