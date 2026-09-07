import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default LoginLayout;
