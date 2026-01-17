import { SidebarLayout } from "@/components/shared/sidebar-layout";
import type { ReactNode } from "react";

const RegisterNewChildCareCenter = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarLayout title={`Care Center - New Child Registration`}>
      <div className="flex flex-col min-h-screen w-full px-6">{children}</div>
    </SidebarLayout>
  );
};

export default RegisterNewChildCareCenter;
