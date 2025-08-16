import AuthProvider from "@/components/auth-provider";
 
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

const BureauHeadlayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={[]}>
      <SidebarProvider>{children}</SidebarProvider>;
    </AuthProvider>
  );
};

export default BureauHeadlayout;
