import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const WomenLayout = ({ children }: { children: ReactNode }) => {
  return <SidebarLayout title="Women Module">{children}</SidebarLayout>;
};

export default WomenLayout;
