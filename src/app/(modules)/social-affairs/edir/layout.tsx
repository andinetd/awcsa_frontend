import ModuleGuard from "@/components/shared/module-guard";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import Link from "next/link";
import React, { ReactNode } from "react";

const Edirlayout = ({ children }: { children: ReactNode }) => {
  return (
    <ModuleGuard allowed={["SOCIAL_AFFAIRS", "EDIR"]}>
      <SidebarLayout>{children}</SidebarLayout>;
    </ModuleGuard>
  );
};

export default Edirlayout;
