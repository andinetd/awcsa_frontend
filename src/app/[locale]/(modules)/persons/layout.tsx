"use client";

import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

export default function PersonsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider
      allowedRoles={["SYSTEM"]}
      requiredPermissions={["view_unified_history"]}
    >
      <SidebarLayout title="Unified Support History">
        {children}
      </SidebarLayout>
    </AuthProvider>
  );
}
