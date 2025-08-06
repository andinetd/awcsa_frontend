import ModuleGuard from "@/components/shared/module-guard";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const ElderlyAndDisabledLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ModuleGuard allowed={["SOCIAL_AFFAIRS"]}>
      <SidebarLayout title="Elderly and disable">{children}</SidebarLayout>;
    </ModuleGuard>
  );
};

export default ElderlyAndDisabledLayout;
