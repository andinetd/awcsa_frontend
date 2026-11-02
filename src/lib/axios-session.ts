import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  refreshAccessToken,
} from "@/api/auth/auth";
import type { ClientSignInResponse } from "@/types/api/auth";
import { isPublicAuthPath } from "@/lib/auth-routes";

let interceptorId: number | null = null;
let refreshPromise: Promise<ClientSignInResponse | null> | null = null;

function isAuthEndpoint(url?: string): boolean {
  return (
    !url ||
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/clients/register")
  );
}

function requestRefresh(): Promise<ClientSignInResponse | null> {
  let refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken && typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)wcasf_refresh_token=([^;]*)/);
    if (match) {
      refreshToken = decodeURIComponent(match[1]);
    }
  }

  if (!refreshToken) {
    return Promise.resolve(null);
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await refreshAccessToken(refreshToken);
        if (res?.access_token) {
          useAuthStore
            .getState()
            .setAuthSession(
              res.access_token,
              res.refresh_token || refreshToken,
              useAuthStore.getState().rememberMe,
            );
          return res;
        }
        return null;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

export function setupAuthInterceptor(): void {
  axios.defaults.withCredentials = true;

  if (interceptorId !== null) {
    return;
  }

  // Request interceptor: attach token dynamically from store or cookie
  axios.interceptors.request.use((config) => {
    let token = useAuthStore.getState().token;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)wcasf_auth_token=([^;]*)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  interceptorId = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config;
      const status = error?.response?.status;
      const retried = (config as any)?._retry as boolean | undefined;

      if (
        !config ||
        status !== 401 ||
        retried ||
        isAuthEndpoint(config.url)
      ) {
        return Promise.reject(error);
      }

      (config as any)._retry = true;

      const fresh = await requestRefresh();

      if (fresh?.access_token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${fresh.access_token}`;
        return axios(config);
      }

      useAuthStore.getState().logout();

      // `pathname` is locale-prefixed (e.g. "/en/women/associations/8"), so a
      // naive `endsWith("/login")` check would always be false. Use the
      // shared isPublicAuthPath helper which strips the locale internally.
      if (!isPublicAuthPath(window.location.pathname)) {
        const segments = window.location.pathname.split("/").filter(Boolean);
        const locale = segments[0] === "am" || segments[0] === "en" ? segments[0] : "am";
        window.location.assign(`/${locale}/login`);
      }

      return Promise.reject(error);
    },
  );
}

if (typeof window !== "undefined") {
  setupAuthInterceptor();
}