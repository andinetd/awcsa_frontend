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

  const handleConfirm = () => {
    if (!profile?.id) return;

    const newIsActive = !profile.isActive;

    statusMutation.mutate(
      { id: profile.id, isActive: newIsActive },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.success(
            `Profile ${newIsActive ? "activated" : "deactivated"} successfully`
          );
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update status");
        },
      }
    );
  };

  const newStatus = profile?.isActive ? "deactivate" : "activate";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Profile Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {newStatus} the profile of{" "}
            <strong>
              {profile?.client.firstName} {profile?.client.lastName}
            </strong>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={statusMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={statusMutation.isPending}
          >
            {statusMutation.isPending ? "Updating..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
