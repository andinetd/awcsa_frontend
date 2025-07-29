import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterEmployeeDto, EmployeeRole } from "@/types/employee";
import { formatRole } from "@/lib/utils";
import { format } from "path";

type EditUserDialogProps = {
  open: boolean;
  user: RegisterEmployeeDto | null;
  onOpenChange: (open: boolean) => void;
  onSave: (user: RegisterEmployeeDto) => void;
};

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  user,
  onOpenChange,
  onSave,
}) => {
  const [form, setForm] = useState<Partial<RegisterEmployeeDto>>({});

  useEffect(() => {
    if (user) setForm(user);
  }, [user, open]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Employee Details</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...user, ...form } as RegisterEmployeeDto);
          }}
          className="space-y-3"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={form.firstName || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, phoneNumber: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cityIdNumber">City ID Number</Label>
            <Input
              id="cityIdNumber"
              name="cityIdNumber"
              placeholder="City ID Number"
              value={form.cityIdNumber || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, cityIdNumber: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="OrganizationUnitId">Organization Unit ID</Label>
            <Input
              id="OrganizationUnitId"
              name="OrganizationUnitId"
              placeholder="Organization Unit ID"
              value={form.OrganizationUnitId?.toString() || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  OrganizationUnitId: Number(e.target.value),
                }))
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={form.role || ""}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, role: value as EmployeeRole }))
              }
              required
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EmployeeRole).map((role) => (
                  <SelectItem key={role} value={role}>
                    {formatRole(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.activeStatus ?? true}
              onCheckedChange={(checked) =>
                setForm((f) => ({ ...f, activeStatus: !!checked }))
              }
              id="activeStatus"
            />
            <Label htmlFor="activeStatus">Active</Label>
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

export default EditUserDialog;
