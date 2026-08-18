"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@/types/super-admin";
import {
  useGetUserFormData,
  useChangeUserRole,
  useGetRoleDetails,
} from "@/hooks/super-admin";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSuccess: () => void;
}

export function ChangeRoleDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: ChangeRoleDialogProps) {
  const t = useTranslations(
    "super-admin.userManagement.actions.changeRoleDialog",
  );
  const { data: formData, isLoading: loadingFormData } = useGetUserFormData();
  const changeUserRoleMutation = useChangeUserRole();
  const isSaving = changeUserRoleMutation.isPending;
  const { user: currentUser } = useAuthStore();
  const isSelf = currentUser?.id === user.id;

  const formSchema = useMemo(() => {
    return z.object({
      roleId: z.string().min(1, t("selectRole")),
    });
  }, [t]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: "",
    },
  });

  const watchedRoleId = form.watch("roleId");

  const { data: targetRoleDetails } = useGetRoleDetails(
    watchedRoleId ? Number(watchedRoleId) : undefined,
  );

  const currentRoleId = useMemo(() => {
    if (formData && user) {
      const match = formData.roles.find(
        (r) => r.name === user.employee.role.name,
      );
      return match ? match.id : undefined;
    }
    return undefined;
  }, [formData, user]);

  // Pre-fill current role
  useEffect(() => {
    if (open && formData && user) {
      const currentRole = formData.roles.find(
        (r) => r.name === user.employee.role.name,
      );
      if (currentRole) {
        form.reset({ roleId: String(currentRole.id) });
      }
    }
  }, [open, formData, user, form]);

  const roleChanged =
    watchedRoleId && Number(watchedRoleId) !== currentRoleId;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    changeUserRoleMutation.mutate(
      { userId: user.id, roleId: Number(values.roleId) },
      {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        },
      },
    );
  };

  const currentRole = formData?.roles.find((r) => r.id === currentRoleId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t.rich("description", {
              email: user.email,
              strong: (chunks: React.ReactNode) => (
                <strong className="font-bold">{chunks}</strong>
              ),
            })}
          </DialogDescription>
        </DialogHeader>

        {isSelf && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <ShieldAlert className="h-4 w-4 text-amber-800" />
            <AlertTitle className="text-sm">{t("selfWarningTitle")}</AlertTitle>
            <AlertDescription className="text-xs">
              {t("selfWarningDesc")}
            </AlertDescription>
          </Alert>
        )}

        {loadingFormData ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {t("currentRole")}:
              </span>
              <Badge variant="outline">
                {(currentRole?.name || user.employee.role.name).replace(
                  /_/g,
                  " ",
                )}
              </Badge>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("roleLabel")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectRole")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formData?.roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              {role.name.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {roleChanged && (
                  <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <ShieldCheck className="h-4 w-4 text-blue-800" />
                    <AlertTitle className="text-sm">
                      {t("targetTitle")}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      {t("targetPermissions", {
                        count: targetRoleDetails?.assignedPermissions?.length ??
                          0,
                      })}
                      {targetRoleDetails?.isSystemRole &&
                        ` (${t("systemRole")})`}
                    </AlertDescription>
                  </Alert>
                )}

                <DialogFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("saveChanges")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}