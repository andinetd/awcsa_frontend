"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUpdateWomenProfileStatusMutation } from "@/hooks/womens";
import { toast } from "sonner";
import { WomenProfile } from "@/api/womens/women-profile";
import { useTranslations } from "next-intl";

interface StatusToggleDialogProps {
  profile: WomenProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StatusToggleDialog({
  profile,
  open,
  onOpenChange,
}: StatusToggleDialogProps) {
  const statusMutation = useUpdateWomenProfileStatusMutation();
  const t = useTranslations("women");

  const handleConfirm = () => {
    if (!profile?.id) return;

    const newIsActive = !profile.isActive;

    statusMutation.mutate(
      { id: profile.id, isActive: newIsActive },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success(t("status.success"));
        },
        onError: (error: any) => {
          toast.error(error?.message || t("status.error"));
        },
      },
    );
  };

  const newStatus = profile?.isActive
    ? t("status.inactive")
    : t("status.active");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xs border border-[#E3E7EB] bg-white shadow-lg p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm font-bold text-[#0B1F3A]">{t("status.title")}</AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500">
            {t("status.description", { status: newStatus })}{" "}
            <strong className="text-slate-800 font-semibold">
              {profile?.client.firstName} {profile?.client.lastName}
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel disabled={statusMutation.isPending} className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]">
            {t("form.buttons.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={statusMutation.isPending}
            className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs"
          >
            {statusMutation.isPending
              ? t("form.buttons.saving")
              : t("form.buttons.save")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}