import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const WomenDashboard = () => {
  return (
    <SidebarProvider>
      <div className="flex items-center justify-center h-full w-full text-3xl">
        Women Dashboard
      </div>
    </SidebarProvider>
  );
};

export default WomenDashboard;
