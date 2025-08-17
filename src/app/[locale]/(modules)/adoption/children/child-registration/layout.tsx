import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const RegisterNewChild = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full  px-6">{children}</div>
  );
};

export default RegisterNewChild;
