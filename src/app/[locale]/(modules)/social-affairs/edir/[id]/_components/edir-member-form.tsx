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
          <Button size="sm" className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {t("buttons.add")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono">
            {isEditMode ? t("title.update") : t("title.add")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {isEditMode ? t("description.update") : t("description.add")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.fullName")}</FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                      placeholder={t("placeholders.fullName")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.cityId")}</FormLabel>
                    <FormControl>
                      <Input
                        className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                        placeholder={t("placeholders.cityId")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.phone")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("placeholders.phone")} {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.job")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("placeholders.job")} {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.position")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                          <SelectValue
                            placeholder={t("placeholders.position")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xs border-[#E3E7EB]">
                        <SelectItem value="MEMBER" className="text-xs rounded-xs">{tp("MEMBER")}</SelectItem>
                        <SelectItem value="LEADER" className="text-xs rounded-xs">{tp("LEADER")}</SelectItem>
                        <SelectItem value="COMMITTEE" className="text-xs rounded-xs">
                          {tp("COMMITTEE")}
                        </SelectItem>
                        <SelectItem value="SECRETARY" className="text-xs rounded-xs">
                          {tp("SECRETARY")}
                        </SelectItem>
                        <SelectItem value="CASHIER" className="text-xs rounded-xs">{tp("CASHIER")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="familyMembersCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.familyMembers")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="number" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joinedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.joinedAt")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="date" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="leftAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.leftAt")}</FormLabel>
                    <FormControl>
                      <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="date" {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xs border border-[#E3E7EB] bg-slate-50/40 p-3">
                  <FormControl>
                    <Checkbox
                      className="rounded-xs data-[state=checked]:bg-[#1769AA] data-[state=checked]:border-[#1769AA]"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5 leading-none">
                    <FormLabel className="text-xs font-medium text-slate-700 cursor-pointer">{t("fields.isActive")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
                onClick={() => setOpen(false)}
              >
                {t("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs"
              >
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
