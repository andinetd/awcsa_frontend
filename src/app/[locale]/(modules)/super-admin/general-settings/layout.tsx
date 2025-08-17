import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const GeneralSettingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={["Bureau_Manager"]}>
      <SidebarLayout title="General Settings">{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default GeneralSettingLayout;
