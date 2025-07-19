import { ProtectedRoute } from "@/components/shared/protected-route";
import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React from "react";

const SocialsDashboard = () => {
  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="flex items-center justify-center h-full text-3xl">
          Socials Dashboard
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
};

export default SocialsDashboard;
