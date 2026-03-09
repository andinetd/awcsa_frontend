"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/super-admin";
import { useGetUsers } from "@/hooks/super-admin";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { Plus, Shield } from "lucide-react";
import { UserDialog } from "./_components/user-dialog";
import { ChangeRoleDialog } from "./_components/change-role-dialog";
import { ChangePermissionsDialog } from "./_components/change-permissions-dialog";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserManagementPage() {
  const t = useTranslations("super-admin.userManagement");
  const { data: users = [], isLoading, refetch } = useGetUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  const columns = getColumns({
    onUserUpdated: refetch,
    onChangeRole: (user: User) => {
      setSelectedUser(user);
      setRoleDialogOpen(true);
    },
    onChangePermissions: (user: User) => {
      setSelectedUser(user);
      setPermissionsDialogOpen(true);
    },
    t: (key) => t(`table.${key}`),
  });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> {t("addUser")}
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

      {selectedUser && (
        <>
          <ChangeRoleDialog
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
            user={selectedUser}
            onSuccess={() => {}}
          />
          <ChangePermissionsDialog
            open={permissionsDialogOpen}
            onOpenChange={setPermissionsDialogOpen}
            user={selectedUser}
            onSuccess={() => {}}
          />
        </>
      )}
    </div>
  );
}
