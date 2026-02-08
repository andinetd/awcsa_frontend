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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface UserActionsProps {
  user: User;
  onUserUpdated: () => void;
  onEdit: (user: User) => void;
}

export function UserActions({ user, onUserUpdated, onEdit }: UserActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const updateStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetUserPassword();

  const loading =
    updateStatusMutation.isPending ||
    deleteUserMutation.isPending ||
    resetPasswordMutation.isPending;

  const handleStatusChange = async () => {
    const newStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
    updateStatusMutation.mutate(
      { id: user.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `User ${newStatus === "ACTIVE" ? "activated" : "locked"} successfully`,
          );
        },
      },
    );
  };

  const handleDelete = async () => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      },
    });
  };

  const handlePasswordReset = async () => {
    if (!newPassword) {
      toast.error("Password is required");
      return;
    }

    resetPasswordMutation.mutate(
      { id: user.id, password: newPassword },
      {
        onSuccess: () => {
          setPasswordResetOpen(false);
          setNewPassword("");
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(user.email)}
          >
            Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleStatusChange}>
            {user.status === "ACTIVE" ? (
              <>
                <Lock className="mr-2 h-4 w-4" /> Lock Account
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" /> Activate Account
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPasswordResetOpen(true)}>
            <Key className="mr-2 h-4 w-4" /> Reset Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={passwordResetOpen} onOpenChange={setPasswordResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for <strong>{user.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordResetOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePasswordReset} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
