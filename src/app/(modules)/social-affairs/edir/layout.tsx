import { SidebarLayout } from "@/components/shared/sidebar-layout";
import Link from "next/link";
import React, { ReactNode } from "react";

const Edirlayout = ({ children }: { children: ReactNode }) => {
  return <SidebarLayout>{children}</SidebarLayout>;
};

export default Edirlayout;
