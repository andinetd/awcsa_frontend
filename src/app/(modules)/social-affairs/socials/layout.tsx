import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const SocialAffairslayout = ({ children }: { children: ReactNode }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default SocialAffairslayout;
