"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useGetUserFormData } from "@/hooks/super-admin";
import { RoleDialog } from "./_components/role-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Plus, Loader2, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GeneralSettings() {
  const t = useTranslations("super-admin.settings.roleManagement");
  const { data: formData, isLoading, refetch } = useGetUserFormData();

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>();

  const handleCreateRole = () => {
    setSelectedRoleId(undefined);
    setRoleDialogOpen(true);
  };

  const handleManagePermissions = (roleId: number) => {
    setSelectedRoleId(roleId);
    setRoleDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <Button onClick={handleCreateRole} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addRole")}
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
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
                          System
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground text-sm">
                    {role.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManagePermissions(role.id)}
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
                    colSpan={3}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No roles found.
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
        onSuccess={() => refetch()}
      />
    </div>
  );
}
