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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white border border-[#E3E7EB] rounded-xs shadow-2xs">
        <div>
          <h3 className="text-sm font-bold font-mono text-[#0B1F3A] uppercase tracking-wider">{t("title")}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{t("description")}</p>
        </div>
        <Button
          onClick={handleCreateRole}
          className="h-8 rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white text-xs font-semibold shadow-2xs gap-1.5 px-3"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("addRole")}
        </Button>
      </div>

      <div className="border border-[#E3E7EB] rounded-xs bg-white shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50 border-b border-[#E3E7EB]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">{t("table.name")}</TableHead>
                <TableHead className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">{t("table.description")}</TableHead>
                <TableHead className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">{t("table.users")}</TableHead>
                <TableHead className="text-right text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 h-9">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#E3E7EB]">
              {formData?.roles.map((role) => (
                <TableRow key={role.id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="font-medium py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0B1F3A]">
                        {role.name.replace(/_/g, " ")}
                      </span>
                      {role.isSystemRole && (
                        <Badge
                          variant="outline"
                          className="rounded-xs font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                          {t("table.system")}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-slate-600 text-xs py-3">
                    {role.description}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className="rounded-xs font-mono text-[10px] font-medium border-[#E3E7EB] bg-slate-100 text-slate-700 px-2 py-0.5"
                    >
                      {role.userCount ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleManagePermissions(role.id, role.userCount)
                      }
                      className="h-7 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 gap-1.5 px-2.5 shadow-2xs"
                    >
                      <Settings2 className="h-3.5 w-3.5 text-slate-500" />
                      {t("table.managePermissions")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {formData?.roles.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-slate-500 text-xs"
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