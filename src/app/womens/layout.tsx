import { SidebarLayout } from "@/components/shared/sidebar-layout";
import Link from "next/link";
import React, { ReactNode } from "react";

const WomenLayout = ({ children }: { children: ReactNode }) => {
  return <SidebarLayout title="Women Module">{children}</SidebarLayout>;
};

export default WomenLayout;
