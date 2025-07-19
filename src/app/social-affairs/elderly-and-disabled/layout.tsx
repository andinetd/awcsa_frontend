import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import React, { ReactNode } from "react";

const ElderlyAndDisabledLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarLayout title="Elderly and disable">
      <div>{children}</div>
    </SidebarLayout>
  );
};

export default ElderlyAndDisabledLayout;
