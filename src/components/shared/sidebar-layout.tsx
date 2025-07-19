"use client";

import type React from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { DynamicSidebar } from "./dynamic-sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function SidebarLayout({ children, title }: SidebarLayoutProps) {
  const currentRole = useCurrentRole();

  return (
    <SidebarProvider>
      <DynamicSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <SidebarTrigger />
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
