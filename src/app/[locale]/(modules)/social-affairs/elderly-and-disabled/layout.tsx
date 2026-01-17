import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const ElderlyAndDisabledLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={["SOCIAL_AFFAIRS", null]}>
      <SidebarLayout title="Disability & Elderly Module">
        {children}
      </SidebarLayout>
    </AuthProvider>
  );
};

export default ElderlyAndDisabledLayout;
