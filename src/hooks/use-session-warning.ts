"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { refreshAccessToken } from "@/api/auth/auth";

export type WarningReason = "token" | "inactivity";

export function useSessionWarning() {
  const t = useTranslations("components.session");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<WarningReason>("token");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reasonRef = useRef<WarningReason>("token");

  // Keep reasonRef in sync
  useEffect(() => {
    reasonRef.current = reason;
  }, [reason]);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const logout = useCallback(
    (message?: string) => {
      clearCountdown();
      setOpen(false);
      useAuthStore.getState().logout();
      if (message) {
        toast.error(message, { duration: 5000 });
      }
      router.replace("/login");
    },
    [clearCountdown, router],
  );

  const attemptRefresh = useCallback(async (): Promise<boolean> => {
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
  }, []);

  const extend = useCallback(async () => {
    clearCountdown();
    const ok = await attemptRefresh();
    if (ok) {
      setOpen(false);
      toast.success(t("staySignedIn"), { duration: 3000 });
    } else {
      // Refresh failed — force logout
      const msg =
        reasonRef.current === "inactivity"
          ? t("inactivityLogout")
          : t("expired");
      logout(msg);
    }
  }, [attemptRefresh, clearCountdown, logout, t]);

  const dismiss = useCallback(() => {
    const msg =
      reasonRef.current === "inactivity"
        ? t("inactivityLogout")
        : t("expired");
    logout(msg);
  }, [logout, t]);

  /** Start the warning countdown. Called by the session monitor. */
  const startWarning = useCallback(
    (warnReason: WarningReason, seconds: number) => {
      clearCountdown();
      setReason(warnReason);
      setSecondsLeft(seconds);
      setOpen(true);

      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Time's up — force logout
            clearCountdown();
            const msg =
              reasonRef.current === "inactivity"
                ? t("inactivityLogout")
                : t("expired");
            // Use setTimeout to avoid state update during render
            setTimeout(() => logout(msg), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearCountdown, logout, t],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearCountdown();
  }, [clearCountdown]);

  return {
    open,
    reason,
    secondsLeft,
    startWarning,
    extend,
    dismiss,
  };
}
