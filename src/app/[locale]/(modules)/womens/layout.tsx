import AuthProvider from "@/components/auth-provider";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const WomenLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarLayout title="Women Module">{children}</SidebarLayout>;
    </AuthProvider>
  );
};

export default WomenLayout;
