import { SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import React, { ReactNode } from "react";

const SocialAffairslayout = ({ children }: { children: ReactNode }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

export default SocialAffairslayout;
