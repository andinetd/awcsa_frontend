import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import {
  refreshAccessToken,
} from "@/api/auth/auth";
import type { ClientSignInResponse } from "@/types/api/auth";

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
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    return Promise.resolve(null);
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await refreshAccessToken(refreshToken);
        if (res?.access_token && res?.refresh_token) {
          useAuthStore
            .getState()
            .setAuthSession(
              res.access_token,
              res.refresh_token,
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
  if (interceptorId !== null) {
    return;
  }

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

      if (!window.location.pathname.endsWith("/login")) {
        window.location.assign("/login");
      }

      return Promise.reject(error);
    },
  );
}