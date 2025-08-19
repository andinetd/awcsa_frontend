import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const ElderlyAndDisabledLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider allowedRoles={["DEPUTY_MANAGER", "Bureau_Manager"]}>
      <SidebarLayout title="Elderly and disable">{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default ElderlyAndDisabledLayout;
