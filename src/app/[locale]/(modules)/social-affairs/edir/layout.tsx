import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import Link from "next/link";
import React, { ReactNode } from "react";

const Edirlayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarLayout>{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default Edirlayout;
