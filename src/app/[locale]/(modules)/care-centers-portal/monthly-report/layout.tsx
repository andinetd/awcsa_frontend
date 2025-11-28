import { SidebarLayout } from "@/components/shared/sidebar-layout";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarLayout title={`Care Center - Monthly Reporting`}>
      <div className="flex flex-col min-h-screen w-full px-6">{children}</div>
    </SidebarLayout>
  );
};

export default Layout;