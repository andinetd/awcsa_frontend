import AuthProvider from "@/components/auth-provider";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const ComplaintsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarLayout title="Complaint Management">{children}</SidebarLayout>
    </AuthProvider>
  );
};

export default ComplaintsLayout;
