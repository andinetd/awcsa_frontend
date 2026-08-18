"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateRole,
  useGetPermissions,
  useGetRoleDetails,
  useAssignPermissionsToRole,
} from "@/hooks/super-admin";
import { Loader2, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PermissionsMatrix } from "@/components/shared/permissions-matrix";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  roleId?: number;
  userCount?: number;
}

export function RoleDialog({
  open,
  onOpenChange,
  onSuccess,
  roleId,
  userCount,
}: RoleDialogProps) {
  const t = useTranslations("super-admin.settings.roleManagement.dialog");
  const pt = useTranslations(
    "super-admin.userManagement.actions.permissionDialog",
  );

  const createRoleMutation = useCreateRole();
  const assignPermissionsMutation = useAssignPermissionsToRole();
  const { data: allPermissions, isLoading: loadingPermissions } =
    useGetPermissions();
  const { data: roleDetails, isLoading: loadingRoleDetails } =
    useGetRoleDetails(roleId);

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const formSchema = useMemo(() => {
    return z.object({
      name: z.string().min(2, t("errors.nameRequired")),
      description: z.string().min(5, t("errors.descRequired")),
    });
  }, [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Populate form and permissions when editing
  useEffect(() => {
    if (open) {
      if (roleId && roleDetails) {
        form.reset({
          name: roleDetails.name.replace(/_/g, " "),
          description: roleDetails.description,
        });
        setSelectedPermissions(
          roleDetails.assignedPermissions?.map((p) => p.id) ?? [],
        );
      } else if (!roleId) {
        form.reset({ name: "", description: "" });
        setSelectedPermissions([]);
      }
    }
  }, [open, roleId, roleDetails, form]);

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
          .filter((p) => (p.resourceType || "Other") === resource)
          .map((p) => p.id),
      );
      return prev.filter((id) => !removeIds.has(id));
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (roleId) {
      // If editing, we update permissions (name/desc are read-only for roles)
      assignPermissionsMutation.mutate(
        { roleId, permissionIds: selectedPermissions },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        },
      );
    } else {
      // If creating
      createRoleMutation.mutate(values, {
        onSuccess: (newRole) => {
          // After role is created, assign permissions if any are selected
          if (selectedPermissions.length > 0 && newRole?.id) {
            assignPermissionsMutation.mutate(
              { roleId: newRole.id, permissionIds: selectedPermissions },
              {
                onSuccess: () => {
                  form.reset();
                  onOpenChange(false);
                  onSuccess?.();
                },
              },
            );
          } else {
            form.reset();
            onOpenChange(false);
            onSuccess?.();
          }
        },
      });
    }
  };

  const isSaving =
    createRoleMutation.isPending || assignPermissionsMutation.isPending;
  const isLoading = (roleId && loadingRoleDetails) || loadingPermissions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{roleId ? pt("title") : t("title")}</DialogTitle>
          <DialogDescription>
            {roleId ? pt("description") : t("description")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nameLabel")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("namePlaceholder")}
                              {...field}
                              disabled={!!roleId}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("descLabel")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("descPlaceholder")}
                              {...field}
                              disabled={!!roleId}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {roleId && (
                    <Alert className="bg-amber-50 border-amber-200 text-amber-800 py-2">
                      <ShieldAlert className="h-4 w-4 text-amber-800" />
                      <AlertTitle className="text-sm">
                        {pt("warningTitle")}
                      </AlertTitle>
                      <AlertDescription className="text-xs">
                        {pt("warningDesc")}
                        {typeof userCount === "number" && (
                          <span>
                            {" "}
                            ({pt("usersCount", { count: userCount })})
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <PermissionsMatrix
                    permissions={allPermissions ?? []}
                    selected={selectedPermissions}
                    onToggle={handleTogglePermission}
                    onSelectAll={handleSelectAll}
                    onClearAll={handleClearAll}
                  />
                </div>
              </div>

              <DialogFooter className="p-6 border-t bg-slate-50/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {roleId ? pt("save") : t("create")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}