import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const AuditLogsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarLayout title="Audit Logs">{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default AuditLogsLayout;
