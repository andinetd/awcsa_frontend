import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const UserManagementlayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={["Bureau_Manager"]}>
      <SidebarLayout title="User Management">{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default UserManagementlayout;
