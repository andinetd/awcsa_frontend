"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import {
  useAddEdirMemberMutation,
  useUpdateEdirMemberMutation,
} from "@/hooks/social-affairs";
import { memberSchema, MemberSchemaType } from "@/schemas/member-schema";
import { toast } from "sonner";
import { EdirMember } from "@/api/social-affairs/member-types";
import { Plus } from "lucide-react";

interface EdirMemberFormProps {
  associationId: number;
  initialData?: EdirMember;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function EdirMemberForm({
  associationId,
  initialData,
  trigger,
  onSuccess,
}: EdirMemberFormProps) {
  const [open, setOpen] = useState(false);
  const addMutation = useAddEdirMemberMutation();
  const updateMutation = useUpdateEdirMemberMutation();

  const isEditMode = !!initialData;
  const isPending = addMutation.isPending || updateMutation.isPending;

  const form = useForm<MemberSchemaType>({
    resolver: zodResolver(memberSchema) as any,
    defaultValues: {
      fullName: "",
      edirIdNumber: associationId.toString(),
      cityIdNumber: "",
      phoneNumber: "",
      job: "",
      position: "MEMBER",
      familyMembersCount: 0,
      joinedAt: new Date().toISOString().split("T")[0],
      isActive: true,
      leftAt: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        fullName: initialData.fullName,
        edirIdNumber: initialData.edirIdNumber,
        cityIdNumber: initialData.cityIdNumber,
        phoneNumber: initialData.phoneNumber,
        job: initialData.job,
        position: initialData.position,
        familyMembersCount: initialData.familyMembersCount,
        joinedAt: initialData.joinedAt
          ? new Date(initialData.joinedAt).toISOString().split("T")[0]
          : "",
        leftAt: initialData.leftAt
          ? new Date(initialData.leftAt).toISOString().split("T")[0]
          : "",
        isActive: initialData.isActive,
      });
    } else {
      form.reset({
        fullName: "",
        edirIdNumber: associationId.toString(),
        cityIdNumber: "",
        phoneNumber: "",
        job: "",
        position: "MEMBER",
        familyMembersCount: 0,
        joinedAt: new Date().toISOString().split("T")[0],
        isActive: true,
        leftAt: "",
      });
    }
  }, [initialData, form, open, associationId]);

  function onSubmit(values: MemberSchemaType) {
    const payload = {
      ...values,
      edirIdNumber: associationId.toString(), // Ensure it's set
      associationId,
    };

    if (isEditMode && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success("Member updated successfully");
            onSuccess?.();
          },
        }
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast.success("Member added successfully");
          onSuccess?.();
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Member" : "Add New Member"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details of the Edir member."
              : "Enter the details of the new member."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City ID</FormLabel>
                    <FormControl>
                      <Input placeholder="City ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job</FormLabel>
                    <FormControl>
                      <Input placeholder="Job" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="LEADER">Leader</SelectItem>
                        <SelectItem value="COMMITTEE">Committee</SelectItem>
                        <SelectItem value="SECRETARY">Secretary</SelectItem>
                        <SelectItem value="CASHIER">Cashier</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="familyMembersCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Members</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joinedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joined At</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="leftAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Left At (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Active Member</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                  ? "Update Member"
                  : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
