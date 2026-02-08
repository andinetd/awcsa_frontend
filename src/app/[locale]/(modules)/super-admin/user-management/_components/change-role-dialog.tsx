"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/super-admin";
import { useGetUserFormData, useUpdateUser } from "@/hooks/super-admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
});

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSuccess: () => void;
}

export function ChangeRoleDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: ChangeRoleDialogProps) {
  const { data: formData, isLoading: loadingFormData } = useGetUserFormData();
  const updateUserMutation = useUpdateUser();
  const isSaving = updateUserMutation.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: "",
    },
  });

  // Pre-fill current role
  useEffect(() => {
    if (open && formData && user) {
      const currentRole = formData.roles.find(
        (r) => r.name === user.employee.role.name,
      );
      if (currentRole) {
        form.reset({ roleId: String(currentRole.id) });
      }
    }
  }, [open, formData, user, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUserMutation.mutate(
      { id: user.id, data: { roleId: Number(values.roleId) } },
      {
        onSuccess: () => {
          onSuccess();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Select a new role for <strong>{user.email}</strong>.
          </DialogDescription>
        </DialogHeader>

        {loadingFormData ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData?.roles.map((role) => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
