import AuthProvider from "@/components/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const SocialAffairslayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>;
    </AuthProvider>
  );
};

export default SocialAffairslayout;
