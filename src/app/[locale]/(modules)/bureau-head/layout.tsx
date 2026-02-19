import AuthProvider from "@/components/auth-provider";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const BureauHeadlayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default BureauHeadlayout;
