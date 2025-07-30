import ModuleGuard from "@/components/shared/module-guard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const SocialAffairslayout = ({ children }: { children: ReactNode }) => {
  return (
    <ModuleGuard allowed={["SOCIAL_AFFAIRS", "EDIR", "BUREAU_HEAD"]}>
      <SidebarProvider>{children}</SidebarProvider>;
    </ModuleGuard>
  );
};

export default SocialAffairslayout;
