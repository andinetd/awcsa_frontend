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
          <Button variant="ghost" className="h-7 w-7 p-0 rounded-xs border border-transparent hover:border-[#E3E7EB] hover:bg-slate-100">
            <span className="sr-only">{t("label")}</span>
            <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[190px] rounded-xs border border-[#E3E7EB] shadow-md p-1">
          <DropdownMenuItem onClick={handleCopyEmail} className="rounded-xs text-xs py-1.5 cursor-pointer">
            <Copy className="mr-2 h-3.5 w-3.5 text-slate-500" />
            {t("copyEmail")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(user)} className="rounded-xs text-xs py-1.5 cursor-pointer">
            <Edit className="mr-2 h-3.5 w-3.5 text-slate-500" />
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#E3E7EB]" />
          <DropdownMenuItem
            onClick={() => onChangeRole(user)}
            disabled={isSelf}
            className="rounded-xs text-xs py-1.5 cursor-pointer"
          >
            <UserCog className="mr-2 h-3.5 w-3.5 text-slate-500" />
            {t("changeRole")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangePermissions(user)} className="rounded-xs text-xs py-1.5 cursor-pointer">
            <Shield className="mr-2 h-3.5 w-3.5 text-slate-500" />
            {t("changePermissions")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleStatusChange}
            disabled={isLocking || isActivating || isSelf}
            className="rounded-xs text-xs py-1.5 cursor-pointer"
          >
            {user.status === "LOCKED" ? (
              <>
                <ShieldCheck className="mr-2 h-3.5 w-3.5 text-emerald-600" />
                {t("activate")}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-3.5 w-3.5 text-amber-600" />
                {t("lockAccount")}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleResetPassword} className="rounded-xs text-xs py-1.5 cursor-pointer">
            <KeyRound className="mr-2 h-3.5 w-3.5 text-[#1769AA]" />
            {t("resetPassword")}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#E3E7EB]" />
          <DropdownMenuItem
            className="rounded-xs text-xs py-1.5 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
            onClick={() => setDeleteOpen(true)}
            disabled={isSelf}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5 text-rose-600" />
            {t("deleteAccount")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-md rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
          <AlertDialogHeader className="border-b border-[#E3E7EB] pb-3 mb-2">
            <AlertDialogTitle className="text-base font-bold font-mono text-[#0B1F3A] uppercase tracking-wide">
              {t("permissionDialog.deleteTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              {t("permissionDialog.deleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
            <AlertDialogCancel className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50">
              {t("permissionDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 text-xs rounded-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-2xs gap-1.5 px-3"
            >
              {isDeleting ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
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
