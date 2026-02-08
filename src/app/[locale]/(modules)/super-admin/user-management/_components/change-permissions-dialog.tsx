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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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
      } else if (user && formData?.roles) {
        const userRoleName = user.employee.role.name;
        const matchingRole = formData.roles.find(
          (r) => r.name === userRoleName,
        );
        if (matchingRole) {
          setSelectedRoleId(String(matchingRole.id));
        }
      }
    } else {
      setSelectedRoleId("");
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

  // Group permissions by resource type
  const permissionsByResource = allPermissions?.reduce(
    (acc, perm) => {
      const resource = perm.resourceType || "Other";
      if (!acc[resource]) {
        acc[resource] = [];
      }
      acc[resource].push(perm);
      return acc;
    },
    {} as Record<string, typeof allPermissions>,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!roleId && (
            <div className="max-w-md">
              <Label className="mb-2 block">{t("selectRole")}</Label>
              <Select
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                disabled={loadingFormData}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("chooseRole")} />
                </SelectTrigger>
                <SelectContent>
                  {formData?.roles.map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedRoleId && (
            <>
              <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <ShieldAlert className="h-4 w-4 text-amber-800" />
                <AlertTitle>{t("warningTitle")}</AlertTitle>
                <AlertDescription>{t("warningDesc")}</AlertDescription>
              </Alert>

              {isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(permissionsByResource || {}).map(
                    ([resource, permissions]) => (
                      <div key={resource} className="rounded-lg border p-4">
                        <h3 className="mb-4 text-lg font-semibold capitalize">
                          {resource.replace(/_/g, " ").toLowerCase()}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-2"
                            >
                              <Checkbox
                                id={`perm-${permission.id}`}
                                checked={selectedPermissions.includes(
                                  permission.id,
                                )}
                                onCheckedChange={() =>
                                  handleTogglePermission(permission.id)
                                }
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label
                                  htmlFor={`perm-${permission.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {permission.name.replace(/_/g, " ")}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button onClick={onSave} disabled={isSaving || !selectedRoleId}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
