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
import { UserData } from "./UserColumns";

type EditUserDialogProps = {
  open: boolean;
  user: UserData | null;
  onOpenChange: (open: boolean) => void;
  onSave: (user: UserData) => void;
};

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  user,
  onOpenChange,
  onSave,
}) => {
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user, open]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...user, ...form });
          }}
          className="space-y-3"
        >
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
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
