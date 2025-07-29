import ModuleGuard from "@/components/shared/module-guard";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const BureauHeadlayout = ({ children }: { children: ReactNode }) => {
  return (
    <ModuleGuard allowed={["BUREAU_HEAD"]}>
      <SidebarLayout>{children}</SidebarLayout>;
    </ModuleGuard>
  );
};

export default BureauHeadlayout;
