import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ReactNode } from "react";

const RegisterNewChild = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarLayout title={`የህፃናት መመዝገቢያ (New Child Registration)`}>
      <div className="flex flex-col min-h-screen w-full  px-6">{children}</div>
    </SidebarLayout>
  );
};

export default RegisterNewChild;
