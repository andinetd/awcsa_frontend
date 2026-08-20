"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./ui/sonner";
import { queryClient } from "@/utils/queryClient";
import { setupAuthInterceptor } from "@/lib/axios-session";
import { useSessionMonitor } from "@/hooks/use-session-monitor";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAuthInterceptor();
  }, []);

  useSessionMonitor();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
      <Toaster richColors />
    </>
  );
}