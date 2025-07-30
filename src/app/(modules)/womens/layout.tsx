import ModuleGuard from "@/components/shared/module-guard";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const WomenLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ModuleGuard allowed={["WOMEN_AFFAIRS"]}>
      <SidebarLayout title="Women Module">{children}</SidebarLayout>;
    </ModuleGuard>
  );
};

export default WomenLayout;
