"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useUpdateEdirCouncilMutation,
} from "@/hooks/social-affairs";
import { EdirCouncil } from "@/api/social-affairs/edir";
import {
  councilLeadershipMemberSchema,
  CouncilLeadershipMember,
} from "@/schemas/edir-council";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCheck, Plus, Trash2, Users } from "lucide-react";

const leadershipFormSchema = z.object({
  leadershipMembers: z.array(councilLeadershipMemberSchema),
});

type LeadershipFormValues = z.infer<typeof leadershipFormSchema>;

const COMMON_ROLE_SUGGESTIONS = [
  "Vice Chairperson",
  "Secretary",
  "Treasurer",
  "Auditor / Audit Head",
  "Public Relations Officer",
  "Women Affairs Coordinator",
  "Youth Representative",
  "Executive Member",
  "Legal Advisor",
];

interface Props {
  council: EdirCouncil;
  trigger?: React.ReactNode;
}

export default function ManageLeadershipDialog({ council, trigger }: Props) {
  const t = useTranslations("social-affairs.edir.councils");
  const [open, setOpen] = useState(false);
  const updateMutation = useUpdateEdirCouncilMutation();

  const form = useForm<LeadershipFormValues>({
    resolver: zodResolver(leadershipFormSchema),
    defaultValues: {
      leadershipMembers: Array.isArray(council.leadershipMembers)
        ? council.leadershipMembers
        : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "leadershipMembers",
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      form.reset({
        leadershipMembers: Array.isArray(council.leadershipMembers)
          ? council.leadershipMembers
          : [],
      });
    }
  };

  const onSubmit = async (values: LeadershipFormValues) => {
    try {
      await updateMutation.mutateAsync({
        councilId: council.id,
        data: {
          leadershipMembers: values.leadershipMembers,
        },
      });
      toast.success(
        t.has("leadershipDialog.success")
          ? t("leadershipDialog.success")
          : "Leadership members updated successfully"
      );
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || t("leadershipDialog.error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] hover:bg-[#d6e7f7] hover:text-[#12568E]"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5" />
            <span>{t("leadershipDialog.addLeaderButton")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#1769AA]" />
            <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("leadershipDialog.title")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {t("leadershipDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Datalist for fast role selection or auto-complete */}
            <datalist id="council-dialog-role-suggestions">
              {COMMON_ROLE_SUGGESTIONS.map((role) => {
                const localizedRole = t.has(`commonRoles.${role}` as any)
                  ? t(`commonRoles.${role}` as any)
                  : role;
                return (
                  <React.Fragment key={role}>
                    <option value={localizedRole} />
                    {localizedRole !== role && <option value={role} />}
                  </React.Fragment>
                );
              })}
            </datalist>

            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-500" />
                <span>{t("executiveCommitteeCount", { count: fields.length })}</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    fullName: "",
                    role: "",
                    phoneNumber: "",
                    address: "",
                  })
                }
                className="h-7 text-xs font-mono rounded-xs border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA] hover:bg-[#d6e7f7] hover:text-[#12568E] gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("leadershipDialog.addLeaderButton")}</span>
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-slate-50/60 p-8 text-center space-y-2">
                <Users className="w-7 h-7 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  {t("leadershipDialog.emptyTitle")}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t("leadershipDialog.emptyDesc")}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {fields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="rounded-xs border border-[#E3E7EB] bg-slate-50/40 p-3.5 space-y-2.5 relative group hover:border-[#BCD5EA] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0B1F3A] text-white px-1.5 py-0.2 rounded-xs">
                        {t("leadershipDialog.leaderNumber", { index: index + 1 })}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-6 px-1.5 text-[11px] font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xs gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t("leadershipDialog.remove")}</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Member Full Name */}
                      <FormField
                        control={form.control}
                        name={`leadershipMembers.${index}.fullName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                              {t("leadershipDialog.fullName")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Abebe Bikila"
                                className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10.5px]" />
                          </FormItem>
                        )}
                      />

                      {/* Custom Role / Position Label */}
                      <FormField
                        control={form.control}
                        name={`leadershipMembers.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                              {t("leadershipDialog.role")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                list="council-dialog-role-suggestions"
                                placeholder="Type or select role..."
                                className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10.5px]" />
                          </FormItem>
                        )}
                      />

                      {/* Phone Number */}
                      <FormField
                        control={form.control}
                        name={`leadershipMembers.${index}.phoneNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                              {t("leadershipDialog.phone")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. 0911223344"
                                className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10.5px]" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {t("leadershipDialog.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
              >
                {updateMutation.isPending ? t("leadershipDialog.saving") : t("leadershipDialog.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}