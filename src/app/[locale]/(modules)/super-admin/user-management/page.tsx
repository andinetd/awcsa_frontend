"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/super-admin";
import { useGetUsers } from "@/hooks/super-admin";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
import { UserDialog } from "./_components/user-dialog";
import { ChangePermissionsDialog } from "./_components/change-permissions-dialog";
import { Loader2 } from "lucide-react";

export default function UserManagementPage() {
  const { data: users = [], isLoading } = useGetUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  const columns = getColumns({
    onUserUpdated: () => {},
    onEdit: () => {},
  });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPermissionsDialogOpen(true)}
          >
            <Shield className="mr-2 h-4 w-4" /> Manage Permissions
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DataTable data={users} columns={columns} />
      )}

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUserSaved={() => setDialogOpen(false)}
      />

      <ChangePermissionsDialog
        open={permissionsDialogOpen}
        onOpenChange={setPermissionsDialogOpen}
        onSuccess={() => {
          /* Query invalidation handles updates */
        }}
      />
    </div>
  );
}
