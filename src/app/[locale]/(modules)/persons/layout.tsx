"use client";

import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

export default function PersonsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider requiredPermissions={["view_unified_history"]}>
      <SidebarLayout title="Unified Support History">
        {children}
      </SidebarLayout>
    </AuthProvider>
  );
}
