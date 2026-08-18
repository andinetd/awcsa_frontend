"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Lock,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/super-admin";
import {
  useUpdateUserStatus,
  useDeleteUser,
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
import { ResetPasswordDialog } from "./reset-password-dialog";

interface UserActionsProps {
  user: User;
  onUserUpdated: () => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onChangePermissions: (user: User) => void;
}

export function UserActions({
  user,
  onUserUpdated,
  onEdit,
  onChangeRole,
  onChangePermissions,
}: UserActionsProps) {
  const t = useTranslations("super-admin.userManagement.actions");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const { user: currentUser } = useAuthStore();
  const updateStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();

  const isSelf = currentUser?.id === user.id;

  const isLocking = updateStatusMutation.isPending;
  const isActivating = updateStatusMutation.isPending;
  const isDeleting = deleteUserMutation.isPending;

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

  const handleResetPassword = () => {
    setResetOpen(true);
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
        <DropdownMenuContent align="end" className="w-[190px]">
          <DropdownMenuItem onClick={handleCopyEmail}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copyEmail")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onChangeRole(user)}
            disabled={isSelf}
          >
            <UserCog className="mr-2 h-4 w-4" />
            {t("changeRole")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangePermissions(user)}>
            <Shield className="mr-2 h-4 w-4" />
            {t("changePermissions")}
          </DropdownMenuItem>
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
          <DropdownMenuItem onClick={handleResetPassword}>
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
      <ResetPasswordDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        userId={user.id}
        userEmail={user.email}
      />
    </>
  );
}
