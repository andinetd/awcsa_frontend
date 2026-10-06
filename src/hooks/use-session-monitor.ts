"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/auth-store";
import { refreshAccessToken } from "@/api/auth/auth";
import type { JwtPayload } from "@/types/api/auth";
import type { WarningReason } from "@/hooks/use-session-warning";

const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes idle timeout
const SILENT_REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // Try silent refresh 5 minutes before token expires
const EXPIRY_WARNING_THRESHOLD_MS = 2 * 60 * 1000; // Only warn user if under 2 minutes left
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

        // 1. If nearing expiry, attempt silent background refresh
        if (msUntilExpiry < SILENT_REFRESH_THRESHOLD_MS) {
          if (
            refreshToken &&
            idleMilliseconds < INACTIVITY_MS &&
            !isRefreshingRef.current
          ) {
            isRefreshingRef.current = true;
            try {
              const res = await refreshAccessToken(refreshToken);
              if (res?.access_token) {
                useAuthStore
                  .getState()
                  .setAuthSession(
                    res.access_token,
                    res.refresh_token || refreshToken,
                    rememberMe,
                  );
                return;
              }
            } catch (err) {
              console.warn("Silent background token refresh failed:", err);
            } finally {
              isRefreshingRef.current = false;
            }
          }

          // 2. Only show warning modal if token is critically close to expiring (<= 2 minutes)
          if (msUntilExpiry <= EXPIRY_WARNING_THRESHOLD_MS) {
            const secondsUntilExpiry = Math.max(
              0,
              Math.floor(msUntilExpiry / 1000),
            );
            onWarning("token", Math.min(secondsUntilExpiry, WARNING_SECONDS));
          }
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
