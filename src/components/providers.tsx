"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./ui/sonner";
import { queryClient } from "@/utils/queryClient";

export default function Providers({ children }: { children: React.ReactNode }) {
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
