"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Key,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Shield,
  Copy,
  UserCog,
  ShieldCheck,
  KeyRound,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/super-admin";
import {
  useUpdateUserStatus,
  useDeleteUser,
  useResetUserPassword,
} from "@/hooks/super-admin";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
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
import { useTranslations } from "next-intl";
import { ChangeRoleDialog } from "./change-role-dialog";

interface UserActionsProps {
  user: User;
  onUserUpdated: () => void;
  onChangeRole: (user: User) => void;
  onChangePermissions: (user: User) => void;
}

export function UserActions({
  user,
  onUserUpdated,
  onChangeRole,
  onChangePermissions,
}: UserActionsProps) {
  const t = useTranslations("super-admin.userManagement.actions");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { user: currentUser } = useAuthStore();
  const updateStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetUserPassword();

  const isSelf = currentUser?.id === user.id;

  const isLocking = updateStatusMutation.isPending;
  const isActivating = updateStatusMutation.isPending;
  const isDeleting = deleteUserMutation.isPending;
  const isResetting = resetPasswordMutation.isPending;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email);
    toast.success(t("copyEmail"));
  };

  const handleStatusChange = async () => {
    const newStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    updateStatusMutation.mutate(
      { id: user.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "ACTIVE"
              ? t("messages.activatedSuccess")
              : t("messages.lockedSuccess"),
          );
          onUserUpdated();
        },
      },
    );
  };

  const handleDelete = async () => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        onUserUpdated();
      },
    });
  };

  const handleResetPassword = async () => {
    const newPassword = window.prompt(t("messages.passwordRequired"));
    if (newPassword) {
      resetPasswordMutation.mutate(
        { id: user.id, password: newPassword },
        {
          onSuccess: () => {
            toast.success(t("messages.passwordResetSuccess"));
            onUserUpdated();
          },
        },
      );
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("label")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleCopyEmail}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copyEmail")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onChangeRole(user)}>
            <UserCog className="mr-2 h-4 w-4" />
            {t("changeRole")}
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => onChangePermissions(user)}>
            <Shield className="mr-2 h-4 w-4" />
            {t("changePermissions")}
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={handleStatusChange}
            disabled={isLocking || isActivating || isSelf}
          >
            {user.status === "LOCKED" ? (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                {t("activate")}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {t("lockAccount")}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleResetPassword}
            disabled={isResetting}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {t("resetPassword")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={isSelf}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("deleteAccount")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("permissionDialog.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("permissionDialog.deleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("permissionDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {t("permissionDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
