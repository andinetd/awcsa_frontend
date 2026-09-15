"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/auth-store";
import { refreshAccessToken } from "@/api/auth/auth";
import type { JwtPayload } from "@/types/api/auth";
import type { WarningReason } from "@/hooks/use-session-warning";

const INACTIVITY_MS = 24 * 60 * 60 * 1000;
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
const WARNING_SECONDS = 120;
const WATCHDOG_INTERVAL_MS = 30 * 1000;

interface UseSessionMonitorOpts {
  onWarning: (reason: WarningReason, seconds: number) => void;
}

export function useSessionMonitor({ onWarning }: UseSessionMonitorOpts): void {
  useTranslations("components.session");
  const lastActivityRef = useRef<number>(Date.now());
  const isRefreshingRef = useRef<boolean>(false);

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

    const watchdog = setInterval(async () => {
      const { user, token, refreshToken, rememberMe } = useAuthStore.getState();
      if (!user || !token) {
        return;
      }

      const idleMilliseconds = Date.now() - lastActivityRef.current;

      if (idleMilliseconds >= INACTIVITY_MS) {
        onWarning("inactivity", WARNING_SECONDS);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const expiresAtMs = decoded.exp ? decoded.exp * 1000 : 0;
        const msUntilExpiry = expiresAtMs - Date.now();

        if (msUntilExpiry < REFRESH_THRESHOLD_MS) {
          // If active and refresh token exists, silently refresh in background
          if (
            refreshToken &&
            idleMilliseconds < INACTIVITY_MS &&
            !isRefreshingRef.current
          ) {
            isRefreshingRef.current = true;
            try {
              const res = await refreshAccessToken(refreshToken);
              if (res?.access_token && res?.refresh_token) {
                useAuthStore
                  .getState()
                  .setAuthSession(
                    res.access_token,
                    res.refresh_token,
                    rememberMe,
                  );
                return;
              }
            } catch {
              // Silent refresh failed — surface warning modal to user
            } finally {
              isRefreshingRef.current = false;
            }
          }

          const secondsUntilExpiry = Math.max(
            0,
            Math.floor(msUntilExpiry / 1000),
          );
          onWarning("token", Math.min(secondsUntilExpiry, WARNING_SECONDS));
        }
      } catch {
        onWarning("token", WARNING_SECONDS);
      }
    }, WATCHDOG_INTERVAL_MS);

    return () => {
      events.forEach((event) => window.removeEventListener(event, touch));
      clearInterval(watchdog);
    };
  }, [onWarning]);
}
