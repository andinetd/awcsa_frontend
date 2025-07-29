"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { useAuthStore } from "@/stores/auth-store";
import { hasRequiredPermissions } from "@/utils/permission";
import { useRouter } from "next/navigation";

export default function AdoptionDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) return router.push("/login");

  let canAccess;
  if (user)
    canAccess = hasRequiredPermissions(user.permissions, ["view_clients"]);

  if (!canAccess) {
    return <div>Access Denied</div>;
  }

  if (user.role !== "adoption") {
    return (
      <div className="h-screen flex justify-center items-center">
        Sorry you can not access this module
      </div>
    );
  }
  return (
    <SidebarLayout title="Adoption Dashboard">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Children Statistics</span>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Care Centers</span>
        </div>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Adoption Services Content</span>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Adoption Services Content</span>
      </div>
      <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Adoption Services Content</span>
      </div>
    </SidebarLayout>
  );
}
