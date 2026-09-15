"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetUserFormData,
  useGetPermissions,
  useGetRoleDetails,
  useAssignPermissionsToRole,
} from "@/hooks/super-admin";
import { User } from "@/types/super-admin";
import { Loader2, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PermissionsMatrix } from "@/components/shared/permissions-matrix";

interface ChangePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  user?: User;
  roleId?: number;
}

export function ChangePermissionsDialog({
  open,
  onOpenChange,
  onSuccess,
  user,
  roleId,
}: ChangePermissionsDialogProps) {
  const t = useTranslations(
    "super-admin.userManagement.actions.permissionDialog",
  );
  const { data: formData, isLoading: loadingFormData } = useGetUserFormData();
  const { data: allPermissions, isLoading: loadingPermissions } =
    useGetPermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");

  // Fetch role details (to get assigned permissions) when a role is selected
  const { data: roleDetails, isLoading: loadingRoleDetails } =
    useGetRoleDetails(selectedRoleId ? Number(selectedRoleId) : undefined);

  const assignPermissionsMutation = useAssignPermissionsToRole();
  const isSaving = assignPermissionsMutation.isPending;

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // Initialize selected permissions when role details are loaded
  useEffect(() => {
    if (roleDetails && roleDetails.assignedPermissions) {
      setSelectedPermissions(roleDetails.assignedPermissions.map((p) => p.id));
    } else {
      setSelectedPermissions([]);
    }
  }, [roleDetails]);

  // Pre-select role and reset state
  useEffect(() => {
    if (open) {
      if (roleId) {
        setSelectedRoleId(String(roleId));
        const role = formData?.roles.find((r) => r.id === roleId);
        setSelectedRoleName(role?.name ?? "");
      } else if (user && formData?.roles) {
        const userRoleName = user.employee.role.name;
        const matchingRole = formData.roles.find(
          (r) => r.name === userRoleName,
        );
        if (matchingRole) {
          setSelectedRoleId(String(matchingRole.id));
          setSelectedRoleName(matchingRole.name);
        }
      }
    } else {
      setSelectedRoleId("");
      setSelectedRoleName("");
      setSelectedPermissions([]);
    }
  }, [open, user, roleId, formData]);

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSelectAll = (_resource: string, permissionIds: number[]) => {
    setSelectedPermissions((prev) => {
      const merged = new Set(prev);
      permissionIds.forEach((id) => merged.add(id));
      return Array.from(merged);
    });
  };

  const handleClearAll = (resource: string) => {
    setSelectedPermissions((prev) => {
      const removeIds = new Set(
        (Array.isArray(allPermissions) ? allPermissions : [])
          .filter((perm) => (perm.resourceType || "Other") === resource)
          .map((perm) => perm.id),
      );
      return prev.filter((id) => !removeIds.has(id));
    });
  };

  const selectedRole = formData?.roles.find(
    (r) => r.id === Number(selectedRoleId),
  );

  const onSave = () => {
    if (!selectedRoleId) return;
    assignPermissionsMutation.mutate(
      { roleId: Number(selectedRoleId), permissionIds: selectedPermissions },
      {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        },
      },
    );
  };

  const isLoading = loadingPermissions || loadingRoleDetails || loadingFormData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 rounded-xs border border-[#E3E7EB] bg-white shadow-lg">
        <DialogHeader className="p-5 pb-3 border-b border-[#E3E7EB]">
          <DialogTitle className="text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">{t("title")}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {selectedRoleName
              ? t("descriptionWithRole", {
                  role: selectedRoleName.replace(/_/g, " "),
                  name: user
                    ? `${user.employee.firstName} ${user.employee.lastName}`
                    : "",
                })
              : t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {!roleId && (
              <div className="max-w-md">
                <Label className="mb-1.5 block text-xs font-semibold text-slate-700">{t("selectRole")}</Label>
                <Select
                  value={selectedRoleId}
                  onValueChange={(value) => {
                    setSelectedRoleId(value);
                    const role = formData?.roles.find(
                      (r) => r.id === Number(value),
                    );
                    setSelectedRoleName(role?.name ?? "");
                  }}
                  disabled={loadingFormData}
                >
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                    <SelectValue placeholder={t("chooseRole")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                    {formData?.roles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)} className="text-xs">
                        {role.name.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedRoleId && (
              <Alert className="rounded-xs bg-amber-50 border border-amber-200 text-amber-800 p-3">
                <ShieldAlert className="h-4 w-4 text-amber-800" />
                <AlertTitle className="text-xs font-semibold font-mono uppercase tracking-wider">{t("warningTitle")}</AlertTitle>
                <AlertDescription className="text-xs mt-0.5">
                  {t("warningDesc")}
                  {typeof selectedRole?.userCount === "number" && (
                    <span>
                      {" "}
                      ({t("usersCount", { count: selectedRole.userCount })})
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {selectedRoleId &&
              (isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
                </div>
              ) : (
                <PermissionsMatrix
                  permissions={allPermissions ?? []}
                  selected={selectedPermissions}
                  onToggle={handleTogglePermission}
                  onSelectAll={handleSelectAll}
                  onClearAll={handleClearAll}
                />
              ))}
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-[#E3E7EB] bg-slate-50/50 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving || !selectedRoleId}
            className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5 px-4"
          >
            {isSaving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}