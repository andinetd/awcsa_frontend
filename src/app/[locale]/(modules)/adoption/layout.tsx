import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const Adoptionlayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={["CHILDREN_AFFAIRS", null]}>
      <SidebarLayout title="Adoption Module">{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default Adoptionlayout;
