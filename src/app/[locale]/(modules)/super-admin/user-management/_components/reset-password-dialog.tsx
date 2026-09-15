"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, RefreshCw, KeyRound } from "lucide-react";
import { useResetUserPassword } from "@/hooks/super-admin";
import { toast } from "sonner";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  userEmail: string;
}

const GENERATED_CHARSET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function generatePassword(length = 12) {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += GENERATED_CHARSET[bytes[i] % GENERATED_CHARSET.length];
  }
  return password;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  userId,
  userEmail,
}: ResetPasswordDialogProps) {
  const t = useTranslations(
    "super-admin.userManagement.actions.resetPasswordDialog",
  );
  const resetPasswordMutation = useResetUserPassword();
  const isSaving = resetPasswordMutation.isPending;

  const formSchema = z
    .object({
      password: z
        .string()
        .min(6, t("errors.passwordMin")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.passwordMismatch"),
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset({ password: "", confirmPassword: "" });
      setShowPassword(false);
    }
  }, [open, form]);

  const handleGenerate = () => {
    const generated = generatePassword();
    form.setValue("password", generated, { shouldValidate: true });
    form.setValue("confirmPassword", generated, { shouldValidate: true });
    setShowPassword(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    resetPasswordMutation.mutate(
      { id: userId, password: values.password },
      {
        onSuccess: () => {
          toast.success(t("messages.success"));
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.message || t("messages.error"));
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3 mb-2">
          <DialogTitle className="flex items-center gap-2 text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">
            <KeyRound className="h-4 w-4 text-[#1769AA]" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t.rich("description", {
              email: userEmail,
              strong: (chunks: React.ReactNode) => (
                <strong className="font-semibold text-slate-800">{chunks}</strong>
              ),
            })}
            <span className="mt-2 block text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xs p-2">
              {t("signOutNote")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("newPassword")}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("placeholders.password")}
                        {...field}
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white pr-20"
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 pr-2 text-[11px] font-mono font-medium text-[#1769AA] hover:underline cursor-pointer"
                      onClick={handleGenerate}
                    >
                      <RefreshCw className="h-3 w-3" />
                      {t("generate")}
                    </button>
                  </div>
                  <FormMessage className="text-[11px]">
                    {form.formState.errors.password &&
                      t("errors.passwordMin")}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("confirmPassword")}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("placeholders.confirm")}
                        {...field}
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <FormMessage className="text-[11px]">
                    {form.formState.errors.confirmPassword &&
                      t("errors.passwordMismatch")}
                  </FormMessage>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5 px-4"
              >
                {isSaving && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                {t("reset")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}