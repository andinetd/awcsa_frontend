import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RegisterEmployeeDto, EmployeeRole } from "@/types/employee";
import { formatRole } from "@/lib/utils";

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allRoles: EmployeeRole[];
  onUserAdded: (user: RegisterEmployeeDto) => void;
};

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  allRoles,
  onUserAdded,
}) => {
  const [form, setForm] = useState<Partial<RegisterEmployeeDto>>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    cityIdNumber: "",
    role: allRoles[0] || "",
    OrganizationUnitId: 1,
    activeStatus: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "OrganizationUnitId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserAdded(form as RegisterEmployeeDto);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      cityIdNumber: "",
      role: allRoles[0] || "",
      OrganizationUnitId: 1,
      activeStatus: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={form.firstName || ""}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={form.role || ""}
              onValueChange={(value: string) =>
                setForm((prev) => ({ ...prev, role: value as EmployeeRole }))
              }
              required
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {formatRole(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="OrganizationUnitId">Organization Unit ID</Label>
            <Input
              id="OrganizationUnitId"
              name="OrganizationUnitId"
              placeholder="Organization Unit ID"
              value={form.OrganizationUnitId?.toString() || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={form.activeStatus ?? true}
              onCheckedChange={(checked: boolean) =>
                setForm((f) => ({ ...f, activeStatus: !!checked }))
              }
              id="activeStatus"
            />
            <Label htmlFor="activeStatus">Active</Label>
          </div>
          <DialogFooter>
            <Button type="submit">Add Employee</Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
