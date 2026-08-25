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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("status.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("status.description", { status: newStatus })}{" "}
            <strong>
              {profile?.client.firstName} {profile?.client.lastName}
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={statusMutation.isPending}>
            {t("form.buttons.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={statusMutation.isPending}
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