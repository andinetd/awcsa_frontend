import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const BackupsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarLayout title="Backups">{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default BackupsLayout;
