"use client";

import { useCallback, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./ui/sonner";
import { queryClient } from "@/utils/queryClient";
import { setupAuthInterceptor } from "@/lib/axios-session";
import { useSessionMonitor } from "@/hooks/use-session-monitor";
import { useSessionWarning } from "@/hooks/use-session-warning";
import { SessionWarningModal } from "@/components/session-warning-modal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { open, reason, secondsLeft, startWarning, extend, dismiss } =
    useSessionWarning();

  const handleWarning = useCallback(
    (warnReason: "token" | "inactivity", seconds: number) => {
      startWarning(warnReason, seconds);
    },
    [startWarning],
  );

  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  useSessionMonitor({ onWarning: handleWarning });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
      <SessionWarningModal
        open={open}
        reason={reason}
        secondsLeft={secondsLeft}
        onExtend={extend}
        onDismiss={dismiss}
      />
      <Toaster richColors />
    </>
  );
}