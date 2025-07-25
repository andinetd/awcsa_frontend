import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserData } from "./UserColumns";

type ChangePermissionDialogProps = {
  open: boolean;
  user: UserData | null;
  allRoles: string[];
  onOpenChange: (open: boolean) => void;
  onSave: (user: UserData) => void;
};

const ChangePermissionDialog: React.FC<ChangePermissionDialogProps> = ({
  open,
  user,
  allRoles,
  onOpenChange,
  onSave,
}) => {
  const [access, setAccess] = useState<string[]>([]);

  useEffect(() => {
    if (user) setAccess(user.access);
  }, [user, open]);

  if (!user) return null;

  const handleToggle = (role: string) => {
    setAccess((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Permissions</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...user, access });
          }}
          className="space-y-3"
        >
          <div className="flex flex-wrap gap-2">
            {allRoles.map((role) => (
              <label key={role} className="flex items-center gap-1">
                <Checkbox
                  checked={access.includes(role)}
                  onCheckedChange={() => handleToggle(role)}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePermissionDialog;
