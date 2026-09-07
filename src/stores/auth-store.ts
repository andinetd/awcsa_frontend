import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { refreshAccessToken, logoutApi } from "@/api/auth/auth";
import {
  JwtPayload,
  UserRole,
  JwtUserType,
  EmployeeJwtPayload,
  ClientJwtPayload,
} from "@/types/api/auth";

function applyToken(
  token: string,
  rememberMe: boolean,
  refreshToken: string | undefined,
  set: (s: Partial<AuthState>) => void,
): void {
  try {
    Cookies.set("wcasf_auth_token", token, {
      secure: process.env.NEXT_PUBLIC_SECURE_COOKIES === "true",
      sameSite: "strict",
      ...(rememberMe ? { expires: 7 } : {}),
      path: "/",
    });

    const decodedToken: JwtPayload = jwtDecode(token);
    const { user, entity, auth } = decodedToken;

    const newState: Partial<AuthState> = {
      token,
      refreshToken: refreshToken ?? null,
      rememberMe,
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
      const cfToken = decodedToken as any;
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
    Cookies.remove("wcasf_auth_token");
    set({
      user: null,
      token: null,
      refreshToken: null,
      rememberMe: false,
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
  }
}

interface AuthState {
  user: JwtUserType | null;
  token: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
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
  setAuthSession: (
    token: string,
    refreshToken: string,
    rememberMe: boolean,
  ) => void;
  loadTokenFromCookie: () => void;
  logout: (opts?: { notifyServer?: boolean }) => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      rememberMe: false,
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
        if (!token) {
          get().logout();
          return;
        }
        applyToken(token, get().rememberMe, get().refreshToken ?? undefined, set);
      },

      setAuthSession: (token, refreshToken, rememberMe) => {
        if (!token || !refreshToken) {
          get().logout();
          return;
        }
        applyToken(token, rememberMe, refreshToken, set);
      },

      loadTokenFromCookie: async () => {
        const token = Cookies.get("wcasf_auth_token");
        if (token) {
          try {
            const decoded: JwtPayload = jwtDecode(token);
            const isExpired = decoded.exp
              ? decoded.exp * 1000 < Date.now()
              : false;

            if (isExpired) {
              // Silent restore: try to refresh before dropping the session.
              const refreshToken = get().refreshToken;
              if (refreshToken) {
                const refreshed = await refreshAccessToken(refreshToken);
                if (refreshed.access_token && refreshed.refresh_token) {
                  applyToken(
                    refreshed.access_token,
                    get().rememberMe,
                    refreshed.refresh_token,
                    set,
                  );
                  set({ hydrated: true });
                  return;
                }
              }
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

      logout: (opts) => {
        const { token } = get();
        if (opts?.notifyServer && token) {
          logoutApi(token);
        }
        // `js-cookie` v3 defaults the removal path to the current page path
        // rather than the cookie's original `path: "/"`, so a bare
        // `Cookies.remove(name)` silently fails for cookies set at "/". Pass
        // the matching `path` to actually clear the token from the browser.
        Cookies.remove("wcasf_auth_token", { path: "/" });
        set({
          user: null,
          token: null,
          refreshToken: null,
          rememberMe: false,
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
