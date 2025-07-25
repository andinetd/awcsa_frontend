import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserData } from "./UserColumns";

type DeleteUserDialogProps = {
  open: boolean;
  user: UserData | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (user: UserData) => void;
};

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  user,
  onOpenChange,
  onDelete,
}) => {
  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          Are you sure you want to delete{" "}
          <span className="font-bold">{user.name}</span>?
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => onDelete(user)}>
            Delete
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
