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
      <DialogContent className="max-w-md rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3 mb-2">
          <DialogTitle className="text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t.rich("description", {
              email: user.email,
              strong: (chunks: React.ReactNode) => (
                <strong className="font-semibold text-slate-800">{chunks}</strong>
              ),
            })}
          </DialogDescription>
        </DialogHeader>

        {isSelf && (
          <Alert className="rounded-xs bg-amber-50 border border-amber-200 text-amber-800 p-3">
            <ShieldAlert className="h-4 w-4 text-amber-800" />
            <AlertTitle className="text-xs font-semibold font-mono uppercase tracking-wider">{t("selfWarningTitle")}</AlertTitle>
            <AlertDescription className="text-xs mt-0.5">
              {t("selfWarningDesc")}
            </AlertDescription>
          </Alert>
        )}

        {loadingFormData ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-7 w-7 animate-spin text-[#1769AA]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                {t("currentRole")}:
              </span>
              <Badge
                variant="outline"
                className="rounded-xs font-mono text-[11px] font-medium border border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA]"
              >
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("roleLabel")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                            <SelectValue placeholder={t("selectRole")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xs border-[#E3E7EB] shadow-md">
                          {formData?.roles.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)} className="text-xs">
                              {role.name.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {roleChanged && (
                  <Alert className="rounded-xs bg-[#E8F2FA] border border-[#BCD5EA] text-[#0B1F3A] p-3">
                    <ShieldCheck className="h-4 w-4 text-[#1769AA]" />
                    <AlertTitle className="text-xs font-semibold font-mono uppercase tracking-wider text-[#0B1F3A]">
                      {t("targetTitle")}
                    </AlertTitle>
                    <AlertDescription className="text-xs text-slate-600 mt-0.5">
                      {t("targetPermissions", {
                        count: targetRoleDetails?.assignedPermissions?.length ??
                          0,
                      })}
                      {targetRoleDetails?.isSystemRole &&
                        ` (${t("systemRole")})`}
                    </AlertDescription>
                  </Alert>
                )}

                <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5 px-4"
                  >
                    {isSaving && (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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