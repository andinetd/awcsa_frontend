import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { refreshAccessToken, logoutApi } from "@/api/auth/auth";
import {
  JwtPayload,
  UserRole,
  JwtUserType,
  EmployeeJwtPayload,
  ClientJwtPayload,
  AccountType,
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
      sameSite: "lax",
      ...(rememberMe ? { expires: 7 } : {}),
      path: "/",
    });

    const decodedToken: any = jwtDecode(token);
    console.log("Decoded JWT in auth-store:", decodedToken);

    // Normalize user object from JWT
    const rawUser = decodedToken.user || decodedToken;
    const accountType =
      rawUser.accountType ||
      decodedToken.accountType ||
      (decodedToken.role === "Super_Admin" || decodedToken.roles?.includes("Super_Admin")
        ? "EMPLOYEE"
        : "CLIENT");

    const user: JwtUserType = {
      id: rawUser.id || decodedToken.sub || 1,
      email: rawUser.email || decodedToken.email || "",
      accountType: accountType as AccountType,
    };

    const entity = decodedToken.entity || {
      type: accountType === "EMPLOYEE" ? "Employee" : "Client",
      id: rawUser.id || decodedToken.sub || 1,
      role: decodedToken.role || decodedToken.userRole || rawUser.role || "Super_Admin",
    };

    const auth = decodedToken.auth || {
      permissions: decodedToken.permissions || [],
    };

    const newState: Partial<AuthState> = {
      token,
      refreshToken: refreshToken ?? null,
      rememberMe,
      user,
      entity,
      auth,
      userPermissions: auth?.permissions || decodedToken.permissions || [],
      userRole: (decodedToken.userRole || decodedToken.role || entity?.role) as UserRole,
      department: decodedToken.department ?? null,
      directorateId: decodedToken.directorateId ?? null,
      teamId: decodedToken.teamId ?? null,
      orgUnit: decodedToken.orgUnit ?? null,
      hydrated: true,
    };

    if (user.accountType === "EMPLOYEE") {
      const employeeToken = decodedToken as EmployeeJwtPayload;
      if (employeeToken.entity) newState.entity = employeeToken.entity;
      if (employeeToken.orgUnit) newState.orgUnit = employeeToken.orgUnit;
      if (employeeToken.entity?.role) newState.userRole = employeeToken.entity.role as UserRole;
      if (employeeToken.department) newState.department = employeeToken.department;
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

    console.log("Auth state successfully populated:", newState);
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

const customAuthStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null;
    const sessionData = sessionStorage.getItem(name);
    if (sessionData) return sessionData;

    const localData = localStorage.getItem(name);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed?.state?.rememberMe) {
          return localData;
        } else {
          localStorage.removeItem(name);
        }
      } catch {
        localStorage.removeItem(name);
      }
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      const parsed = JSON.parse(value);
      if (parsed?.state?.rememberMe) {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      } else {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      }
    } catch {
      sessionStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(name);
    localStorage.removeItem(name);
  },
};

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
        if (!token) {
          console.warn("setAuthSession called without token");
          get().logout();
          return;
        }
        applyToken(token, rememberMe, refreshToken || token, set);
      },

      loadTokenFromCookie: async () => {
        const token = Cookies.get("wcasf_auth_token");
        const currentToken = get().token;
        const rememberMe = get().rememberMe;

        // If cookie is gone, clean up any lingering memory/storage state
        if (!token) {
          if (currentToken) {
            get().logout();
          } else {
            set({ hydrated: true });
          }
          return;
        }

        // If rememberMe is false and this tab doesn't have session data,
        // it means the tab was closed and a new one was opened -> end session
        if (
          typeof window !== "undefined" &&
          !rememberMe &&
          !sessionStorage.getItem("auth-store")
        ) {
          get().logout();
          return;
        }

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
        set({ hydrated: true });
      },

      logout: (opts) => {
        const { token } = get();
        if (opts?.notifyServer && token) {
          logoutApi(token);
        }
        Cookies.remove("wcasf_auth_token", { path: "/" });
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("auth-store");
          localStorage.removeItem("auth-store");
        }
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
      name: "auth-store",
      storage: createJSONStorage(() => customAuthStorage),
    },
  ),
);
