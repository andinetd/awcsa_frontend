"use client";

import { useTranslations } from "next-intl";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { ShieldPlus, Edit, Plus, Trash2, UserPlus, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useCreateEdirCouncilMutation,
  useUpdateEdirCouncilMutation,
} from "@/hooks/social-affairs";
import { newEdirCouncilSchema, NewEdirCouncilSchemaType, CouncilLeadershipMember } from "@/schemas/edir-council";
import { toast } from "sonner";
import { EdirCouncil, EdirLevel } from "@/api/social-affairs/edir";
import { EdirCouncilPayload } from "@/api/social-affairs/council-api";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";

interface NewCouncilFormProps {
  initialData?: EdirCouncil;
  councilId?: number;
  trigger?: React.ReactNode;
}

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

export default function NewCouncilForm({
  initialData,
  councilId,
  trigger,
}: NewCouncilFormProps) {
  const t = useTranslations("social-affairs.edir.councils");
  const [open, setOpen] = useState(false);
  const createMutation = useCreateEdirCouncilMutation();
  const updateMutation = useUpdateEdirCouncilMutation();

  const defaultValues: NewEdirCouncilSchemaType = {
    name: "",
    level: "WOREDA",
    subCity: "",
    woreda: "",
    kebele: "",
    establishmentDate: new Date().toISOString().slice(0, 10),
    chairpersonName: "",
    chairpersonPhone: "",
    contactPhone: "",
    address: "",
    leadershipMembers: [],
  };

  const form = useForm<NewEdirCouncilSchemaType>({
    resolver: zodResolver(newEdirCouncilSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "leadershipMembers",
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        name: initialData.name,
        level: initialData.level,
        subCity: initialData.subCity,
        woreda: initialData.woreda || "",
        kebele: initialData.kebele || "",
        establishmentDate: initialData.establishmentDate.slice(0, 10),
        chairpersonName: initialData.chairpersonName || "",
        chairpersonPhone: initialData.chairpersonPhone || "",
        contactPhone: initialData.contactPhone || "",
        address: initialData.address || "",
        leadershipMembers: Array.isArray(initialData.leadershipMembers)
          ? initialData.leadershipMembers
          : [],
      });
    }
    if (open && !initialData) form.reset(defaultValues);
  }, [open, initialData, form]);

  const onSubmit = async (values: NewEdirCouncilSchemaType) => {
    const payload: EdirCouncilPayload = {
      name: values.name,
      level: values.level as EdirLevel,
      subCity: values.subCity,
      woreda: values.woreda || undefined,
      kebele: values.kebele || undefined,
      establishmentDate: values.establishmentDate,
      chairpersonName: values.chairpersonName || undefined,
      chairpersonPhone: values.chairpersonPhone || undefined,
      contactPhone: values.contactPhone || undefined,
      address: values.address || undefined,
      leadershipMembers: values.leadershipMembers || [],
    };

    try {
      if (initialData && councilId) {
        await updateMutation.mutateAsync({ councilId, data: payload });
        toast.success(t("form.messages.successUpdate"));
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(t("form.messages.successCreate"));
      }
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || t("form.messages.saveError"));
    }
  };

  const isEdit = !!initialData;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const watchedLevel = form.watch("level");
  const showWoreda = watchedLevel !== "CITY";
  const watchedSubCity = form.watch("subCity");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs">
            {isEdit ? <Edit className="w-3.5 h-3.5 mr-1.5" /> : <ShieldPlus className="w-3.5 h-3.5 mr-1.5" />}
            {isEdit ? t("buttons.edit") : t("buttons.add")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {isEdit ? t("form.updateTitle") : t("form.createTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {isEdit ? t("form.updateDesc") : t("form.createDesc")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="border-b border-[#E3E7EB] pb-1 text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("form.sections.general")}
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                    {t("form.fields.name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholders.name")}
                      className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.level")}
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xs border-[#E3E7EB]">
                        {(["WOREDA", "SUB_CITY", "CITY"] as EdirLevel[]).map(
                          (level) => (
                            <SelectItem key={level} value={level} className="text-xs font-mono">
                              {t(`level.${level}`)}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="establishmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.establishmentDate")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-b border-[#E3E7EB] pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("form.sections.location")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.subCity")}
                    </FormLabel>
                    <FormControl>
                      <SubCitySelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("form.placeholders.subCity")}
                        extraOptions={watchedLevel === "CITY" ? ["Addis Ababa"] : []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showWoreda && (
                <FormField
                  control={form.control}
                  name="woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                        {t("form.fields.woreda")}
                      </FormLabel>
                      <FormControl>
                        <WoredaSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          subCity={watchedSubCity}
                          placeholder={t("form.placeholders.woreda")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="kebele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.kebele")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.kebele")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-b border-[#E3E7EB] pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("form.sections.leadership")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chairpersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.chairpersonName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.chairpersonName")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chairpersonPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.chairpersonPhone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.chairpersonPhone")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.contactPhone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.placeholders.contactPhone")}
                        className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {t("form.fields.address")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.placeholders.address")}
                        className="text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Additional Leadership Members (User-Defined Custom Roles) ──────────────── */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-[#E3E7EB] pb-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                  <Users className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>
                    {t.has("form.sections.additionalLeadership")
                      ? t("form.sections.additionalLeadership")
                      : "Additional Council Leadership Members"}
                  </span>
                  {fields.length > 0 && (
                    <span className="ml-1 text-[10px] font-mono font-bold bg-[#E8F2FA] text-[#1769AA] px-1.5 py-0.2 rounded-xs border border-[#BCD5EA]">
                      {fields.length}
                    </span>
                  )}
                </div>
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
                  <span>
                    {t.has("form.buttons.addLeader")
                      ? t("form.buttons.addLeader")
                      : "Add Member"}
                  </span>
                </Button>
              </div>

              {/* Datalist for fast role selection or auto-complete */}
              <datalist id="edir-council-role-suggestions">
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

              {fields.length === 0 ? (
                <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-slate-50/60 p-4 text-center">
                  <p className="text-xs text-slate-500">
                    {t.has("leadershipDialog.emptyDesc")
                      ? t("leadershipDialog.emptyDesc")
                      : "No additional leadership members added yet. Click Add Member to appoint executive roles."}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {fields.map((fieldItem, index) => (
                    <div
                      key={fieldItem.id}
                      className="rounded-xs border border-[#E3E7EB] bg-slate-50/40 p-3 space-y-2 relative group hover:border-[#BCD5EA] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          {t.has("leadershipDialog.leaderNumber")
                            ? t("leadershipDialog.leaderNumber", { index: index + 1 })
                            : `Leader #${index + 1}`}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-6 px-1.5 text-[11px] font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xs gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{t.has("leadershipDialog.remove") ? t("leadershipDialog.remove") : "Remove"}</span>
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
                                {t.has("form.fields.leaderName")
                                  ? t("form.fields.leaderName")
                                  : "Full Name"}
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

                        {/* Flexible Role / Position (Freeform with Datalist Suggestions) */}
                        <FormField
                          control={form.control}
                          name={`leadershipMembers.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                                {t.has("form.fields.leaderRole")
                                  ? t("form.fields.leaderRole")
                                  : "Role / Position Label"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  list="edir-council-role-suggestions"
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
                                {t.has("form.fields.leaderPhone")
                                  ? t("form.fields.leaderPhone")
                                  : "Phone Number"}
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
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {t("buttons.dismiss")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
              >
                {isSubmitting ? t("buttons.saving") : t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}