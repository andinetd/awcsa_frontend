import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const ElderlyAndDisabledLayout = ({ children }: { children: ReactNode }) => {
  return <SidebarLayout title="Elderly and disable">{children}</SidebarLayout>;
};

export default ElderlyAndDisabledLayout;
