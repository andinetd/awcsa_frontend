import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { ReactNode } from "react";

const BureauHeadlayout = ({ children }: { children: ReactNode }) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default BureauHeadlayout;
