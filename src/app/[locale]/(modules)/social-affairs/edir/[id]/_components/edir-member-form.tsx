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

import { useTranslations } from "next-intl";

export default function EdirMemberForm({
  associationId,
  initialData,
  trigger,
  onSuccess,
}: EdirMemberFormProps) {
  const t = useTranslations("social-affairs.edir.edir-members.form");
  const tp = useTranslations("social-affairs.edir.edir-members.positions");
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
            toast.success(t("messages.successUpdate"));
            onSuccess?.();
          },
        },
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast.success(t("messages.successAdd"));
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
            {t("buttons.add")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? t("title.update") : t("title.add")}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? t("description.update") : t("description.add")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.fullName")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.fullName")}
                      {...field}
                    />
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
                    <FormLabel>{t("fields.cityId")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders.cityId")}
                        {...field}
                      />
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
                    <FormLabel>{t("fields.phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholders.phone")} {...field} />
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
                    <FormLabel>{t("fields.job")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placeholders.job")} {...field} />
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
                    <FormLabel>{t("fields.position")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("placeholders.position")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEMBER">{tp("MEMBER")}</SelectItem>
                        <SelectItem value="LEADER">{tp("LEADER")}</SelectItem>
                        <SelectItem value="COMMITTEE">
                          {tp("COMMITTEE")}
                        </SelectItem>
                        <SelectItem value="SECRETARY">
                          {tp("SECRETARY")}
                        </SelectItem>
                        <SelectItem value="CASHIER">{tp("CASHIER")}</SelectItem>
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
                    <FormLabel>{t("fields.familyMembers")}</FormLabel>
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
                    <FormLabel>{t("fields.joinedAt")}</FormLabel>
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
                    <FormLabel>{t("fields.leftAt")}</FormLabel>
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
                    <FormLabel>{t("fields.isActive")}</FormLabel>
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
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditMode
                    ? t("buttons.updating")
                    : t("buttons.adding")
                  : isEditMode
                    ? t("buttons.update")
                    : t("buttons.add")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
