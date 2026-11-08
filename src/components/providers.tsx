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

    // Radix UI Pointer-Events recovery: reset body pointer-events if stuck when no modal is open
    const observer = new MutationObserver(() => {
      const hasOpenDialog = !!document.querySelector(
        '[data-state="open"][role="dialog"], [data-state="open"][role="alertdialog"], [data-slot="dialog-content"], [data-slot="alert-dialog-content"]',
      );
      if (!hasOpenDialog && document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "";
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "data-scroll-locked"],
    });

    return () => observer.disconnect();
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