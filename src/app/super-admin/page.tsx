"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";

export default function SuperAdminPage() {
  return (
    <SidebarLayout title="Super Admin Dashboard">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Chart 1</span>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Chart 2</span>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Chart 3</span>
        </div>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Main Content Area</span>
      </div>
    </SidebarLayout>
  );
}
