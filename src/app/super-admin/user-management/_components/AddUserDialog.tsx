import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allRoles: string[];
  onUserAdded: (user: {
    name: string;
    email: string;
    access: string[];
  }) => void;
};

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  allRoles,
  onUserAdded,
}) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    access: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (role: string) => {
    setNewUser((prev) => ({
      ...prev,
      access: prev.access.includes(role)
        ? prev.access.filter((r) => r !== role)
        : [...prev.access, role],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserAdded(newUser);
    setNewUser({ name: "", email: "", access: [] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2">
          <input
            name="name"
            placeholder="Name"
            value={newUser.name}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <div>
            <div className="font-medium mb-1">Roles</div>
            <div className="flex gap-2 flex-wrap">
              {allRoles.map((role) => (
                <label key={role} className="flex items-center gap-1">
                  <Checkbox
                    checked={newUser.access.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-900"
            >
              Add User
            </Button>
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
