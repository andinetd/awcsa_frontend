"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useGetUserFormData } from "@/hooks/super-admin";
import { RoleDialog } from "./role-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings2, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RolesPanel() {
  const t = useTranslations("super-admin.settings.roleManagement");
  const { data: formData, isLoading, refetch } = useGetUserFormData();

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();
  const [selectedUserCount, setSelectedUserCount] = useState<number | undefined>();

  const handleCreateRole = () => {
    setSelectedRoleId(undefined);
    setSelectedUserCount(undefined);
    setRoleDialogOpen(true);
  };

  const handleManagePermissions = (roleId: number, userCount?: number) => {
    setSelectedRoleId(roleId);
    setSelectedUserCount(userCount);
    setRoleDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <Button onClick={handleCreateRole} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addRole")}
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.description")}</TableHead>
                <TableHead>{t("table.users")}</TableHead>
                <TableHead className="text-right">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData?.roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {role.name.replace(/_/g, " ")}
                      {role.isSystemRole && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          {t("table.system")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground text-sm">
                    {role.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{role.userCount ?? 0}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleManagePermissions(role.id, role.userCount)
                      }
                      className="gap-2"
                    >
                      <Settings2 className="h-4 w-4" />
                      {t("table.managePermissions")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {formData?.roles.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-muted-foreground"
                  >
                    {t("table.noRoles")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <RoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        roleId={selectedRoleId}
        userCount={selectedUserCount}
        onSuccess={() => refetch()}
      />
    </div>
  );
}