import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const Adoptionlayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={["Bureau_Manager"]}>
      <SidebarLayout>{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default Adoptionlayout;
