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
import { RegisterEmployeeDto, EmployeeRole } from "@/types/employee";

type ChangePermissionDialogProps = {
  open: boolean;
  user: RegisterEmployeeDto | null;
  allRoles: string[];
  onOpenChange: (open: boolean) => void;
  onSave: (user: RegisterEmployeeDto) => void;
};

const ChangePermissionDialog: React.FC<ChangePermissionDialogProps> = ({
  open,
  user,
  allRoles,
  onOpenChange,
  onSave,
}) => {
  const [role, setRole] = useState<EmployeeRole>(
    user ? user.role : (allRoles[0] as EmployeeRole)
  );

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user, open]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (role) onSave({ ...user, role });
          }}
          className="space-y-3"
        >
          <div className="flex flex-wrap gap-2">
            {allRoles.map((r) => (
              <label key={r} className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={role === r}
                  onChange={() => setRole(r as EmployeeRole)}
                  name="role"
                />
                <span>{r}</span>
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

// This file is no longer needed. The change role functionality is now handled in the EditUserDialog.
export default ChangePermissionDialog;
