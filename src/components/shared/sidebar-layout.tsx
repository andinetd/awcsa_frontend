"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCurrentRole } from "@/hooks/useCurrentRole";
import { DynamicSidebar } from "./dynamic-sidebar";
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";
import LanguageSwitcher from "./language-switcher";

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
          <div className="flex flex-col justify-center">
            {title && (
              <h1 className="text-lg font-semibold leading-none">{title}</h1>
            )}
            {/* <DynamicBreadcrumb /> */}
          </div>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
