"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/auth-store";
import { refreshAccessToken } from "@/api/auth/auth";
import type { JwtPayload } from "@/types/api/auth";

const INACTIVITY_MS = 30 * 60 * 1000;
const REFRESH_THRESHOLD_MS = 2 * 60 * 1000;
const WATCHDOG_INTERVAL_MS = 30 * 1000;

export function useSessionMonitor(): void {
  const t = useTranslations("components.session");
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    const touch = () => {
      lastActivityRef.current = Date.now();
    };

    const events = [
      "pointerdown",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
      "wheel",
    ];
    events.forEach((event) => window.addEventListener(event, touch));

    const logout = (message?: string) => {
      useAuthStore.getState().logout();
      if (message) {
        toast.error(message, { duration: 5000 });
      }
      router.replace("/login");
    };

    const attemptRefresh = async (): Promise<boolean> => {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        return false;
      }
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
          return true;
        }
        return false;
      } catch {
        return false;
      }
    };

    const watchdog = setInterval(() => {
      const { user, token } = useAuthStore.getState();
      if (!user || !token) {
        return;
      }

      const idleMilliseconds = Date.now() - lastActivityRef.current;

      if (idleMilliseconds >= INACTIVITY_MS) {
        attemptRefresh().then((ok) => {
          if (!ok) {
            logout(t("inactivityLogout"));
          }
        });
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const expiresAtMs = decoded.exp ? decoded.exp * 1000 : 0;
        if (expiresAtMs - Date.now() < REFRESH_THRESHOLD_MS) {
          attemptRefresh().then((ok) => {
            if (!ok) {
              logout(t("expired"));
            }
          });
        }
      } catch {
        logout(t("expired"));
      }
    }, WATCHDOG_INTERVAL_MS);

    return () => {
      events.forEach((event) => window.removeEventListener(event, touch));
      clearInterval(watchdog);
    };
  }, [router, t]);
}