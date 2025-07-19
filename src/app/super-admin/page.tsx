"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { useAuthStore } from "@/stores/auth-store";

export default function SuperAdminPage() {
  const { user } = useAuthStore();

  return (
    <SidebarLayout title="Super Admin Dashboard">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">Department: {user?.department}</p>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
            <span>System Analytics</span>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
            <span>User Management</span>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
            <span>Department Overview</span>
          </div>
        </div>

        <div className="min-h-[200px] flex-1 rounded-xl bg-muted/50 flex items-center justify-center">
          <span>Main Content Area</span>
        </div>
      </div>
    </SidebarLayout>
  );
}
