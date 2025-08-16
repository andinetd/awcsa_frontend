import AuthProvider from "@/components/auth-provider";
 
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const BureauHeadlayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={["Bureau_Manager", "DEPUTY_MANAGER"]}>
      <SidebarLayout>{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default BureauHeadlayout;
