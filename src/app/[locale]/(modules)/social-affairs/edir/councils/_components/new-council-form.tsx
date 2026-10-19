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
import { ShieldPlus, Edit, Plus, Trash2, UserPlus, Users, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  useCreateEdirCouncilMutation,
  useUpdateEdirCouncilMutation,
  useUploadEdirDocumentMutation,
  useGetSubCitiesQuery,
  useGetEdirAssociationsQuery,
} from "@/hooks/social-affairs";
import { newEdirCouncilSchema, NewEdirCouncilSchemaType, CouncilLeadershipMember } from "@/schemas/edir-council";
import { toast } from "sonner";
import { EdirCouncil, EdirLevel } from "@/api/social-affairs/edir";
import { EdirCouncilPayload } from "@/api/social-affairs/council-api";
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
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
  "Auditor",
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
  const tSubCities = useTranslations("subCities.names");
  const [open, setOpen] = useState(false);
  const createMutation = useCreateEdirCouncilMutation();
  const updateMutation = useUpdateEdirCouncilMutation();
  const uploadDocMutation = useUploadEdirDocumentMutation();
  const { data: subCities = [] } = useGetSubCitiesQuery();
  const { data: allEdirs = [] } = useGetEdirAssociationsQuery();
  const [byLawsFile, setByLawsFile] = useState<File[]>([]);

  const defaultValues: NewEdirCouncilSchemaType = {
    name: "",
    level: "WOREDA",
    subCity: "",
    woreda: "",
    establishmentDate: new Date().toISOString().slice(0, 10),
    chairpersonName: "",
    chairpersonPhone: "",
    contactPhone: "",
    address: "",
    leadershipMembers: [],
    byLawsDocId: undefined,
  };

  const form = useForm<NewEdirCouncilSchemaType>({
    resolver: zodResolver(newEdirCouncilSchema) as any,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "leadershipMembers",
  });

  const handleByLawsSelect = (files: File[]) => {
    setByLawsFile(files);
    if (files.length > 0) {
      uploadDocMutation.mutate(files[0], {
        onSuccess: (doc) => {
          form.setValue("byLawsDocId", doc.id);
          toast.success(
            t.has("form.messages.byLawsUploaded")
              ? t("form.messages.byLawsUploaded")
              : "Document uploaded successfully",
          );
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to upload document");
          setByLawsFile([]);
          form.setValue("byLawsDocId", undefined);
        },
      });
    } else {
      form.setValue("byLawsDocId", undefined);
    }
  };

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        name: initialData.name,
        level: initialData.level,
        subCity: initialData.subCity,
        woreda: initialData.woreda || "",
        establishmentDate: initialData.establishmentDate.slice(0, 10),
        chairpersonName: initialData.chairpersonName || "",
        chairpersonPhone: initialData.chairpersonPhone || "",
        contactPhone: initialData.contactPhone || "",
        address: initialData.address || "",
        leadershipMembers: Array.isArray(initialData.leadershipMembers)
          ? initialData.leadershipMembers
          : [],
        byLawsDocId: (initialData as any)?.byLawsDoc?.id ?? undefined,
      });
      setByLawsFile([]);
    }
    if (open && !initialData) {
      form.reset(defaultValues);
      setByLawsFile([]);
    }
  }, [open, initialData, form]);

  const onSubmit = async (values: NewEdirCouncilSchemaType) => {
    const payload: EdirCouncilPayload = {
      name: values.name,
      level: values.level as EdirLevel,
      subCity: values.subCity,
      woreda: values.woreda || undefined,
      establishmentDate: values.establishmentDate,
      chairpersonName: values.chairpersonName || undefined,
      chairpersonPhone: values.chairpersonPhone || undefined,
      contactPhone: values.contactPhone || undefined,
      address: values.address || undefined,
      leadershipMembers: values.leadershipMembers || [],
      byLawsDocId: values.byLawsDocId ?? undefined,
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
  const watchedWoreda = form.watch("woreda");

  const currentSubCityObj = subCities.find(
    (s) => s.name.toLowerCase() === (watchedSubCity || "").toLowerCase()
  );
  const subCityWoredas = currentSubCityObj?.woredas?.map((w) => w.code) || [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14",
  ];

  const candidateEdirs = allEdirs.filter((e: any) => {
    if (watchedSubCity && e.subCity && e.subCity.toLowerCase() !== watchedSubCity.toLowerCase()) {
      return false;
    }
    if (watchedWoreda && e.woreda && String(e.woreda) !== String(watchedWoreda)) {
      return false;
    }
    return true;
  });

  const getSubCityLabel = (name: string) => {
    try {
      if (tSubCities.has(name as any)) {
        return tSubCities(name as any);
      }
      return name;
    } catch {
      return name;
    }
  };

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
      <DialogContent className="max-h-[85vh] overflow-y-auto max-w-3xl rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
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
                          <SelectValue placeholder={t("form.fields.level")}>
                            {field.value ? t(`level.${field.value}` as any) : undefined}
                          </SelectValue>
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
                      representedEntity: "",
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
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
                                  placeholder={t("form.placeholders.leaderName")}
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
                                  placeholder={t("form.placeholders.leaderRole")}
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
                                  placeholder={t("form.placeholders.leaderPhone")}
                                  className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10.5px]" />
                            </FormItem>
                          )}
                        />

                        {/* Originating Representation: Edir (if Woreda), Woreda (if Sub-City), Sub-City (if City) */}
                        {watchedLevel === "WOREDA" && (
                          <FormField
                            control={form.control}
                            name={`leadershipMembers.${index}.representedEntity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                                  {t.has("form.fields.leaderRepresentedEdir")
                                    ? t("form.fields.leaderRepresentedEdir")
                                    : "Representing Edir"}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    list={`edir-council-candidates-${index}`}
                                    placeholder={
                                      t.has("form.placeholders.leaderRepresentedEdir")
                                        ? t("form.placeholders.leaderRepresentedEdir")
                                        : "Select or enter Edir name"
                                    }
                                    className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <datalist id={`edir-council-candidates-${index}`}>
                                  {candidateEdirs.map((e: any) => (
                                    <option key={e.id} value={e.name}>
                                      {e.name} {e.woreda ? `(Woreda ${e.woreda})` : ""}
                                    </option>
                                  ))}
                                </datalist>
                                <FormMessage className="text-[10.5px]" />
                              </FormItem>
                            )}
                          />
                        )}

                        {watchedLevel === "SUB_CITY" && (
                          <FormField
                            control={form.control}
                            name={`leadershipMembers.${index}.representedEntity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                                  {t.has("form.fields.leaderRepresentedWoreda")
                                    ? t("form.fields.leaderRepresentedWoreda")
                                    : "Representing Woreda"}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || undefined}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]">
                                      <SelectValue
                                        placeholder={
                                          t.has("form.placeholders.leaderRepresentedWoreda")
                                            ? t("form.placeholders.leaderRepresentedWoreda")
                                            : "Select Woreda"
                                        }
                                      >
                                        {field.value ? `Woreda ${field.value}` : undefined}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="max-h-56">
                                    {subCityWoredas.map((wCode) => (
                                      <SelectItem key={wCode} value={wCode} className="text-xs">
                                        Woreda {wCode}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-[10.5px]" />
                              </FormItem>
                            )}
                          />
                        )}

                        {watchedLevel === "CITY" && (
                          <FormField
                            control={form.control}
                            name={`leadershipMembers.${index}.representedEntity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                                  {t.has("form.fields.leaderRepresentedSubCity")
                                    ? t("form.fields.leaderRepresentedSubCity")
                                    : "Representing Sub-City"}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value || undefined}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]">
                                      <SelectValue
                                        placeholder={
                                          t.has("form.placeholders.leaderRepresentedSubCity")
                                            ? t("form.placeholders.leaderRepresentedSubCity")
                                            : "Select Sub-City"
                                        }
                                      >
                                        {field.value ? getSubCityLabel(field.value) : undefined}
                                      </SelectValue>
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="max-h-56">
                                    {subCities.map((sc) => (
                                      <SelectItem key={sc.id || sc.name} value={sc.name} className="text-xs">
                                        {getSubCityLabel(sc.name)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-[10.5px]" />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1769AA]" />
                {t.has("form.sections.documents")
                  ? t("form.sections.documents")
                  : "Council Documents & By-Laws"}
              </h3>
              <div className="rounded-xs border border-[#E3E7EB] p-2 bg-slate-50/20">
                <FileDragAndDrop
                  value={byLawsFile}
                  onChange={handleByLawsSelect}
                  maxFiles={1}
                  acceptedFileTypes={[
                    "application/pdf",
                    "image/jpeg",
                    "image/png",
                  ]}
                />
              </div>
              {form.watch("byLawsDocId") && byLawsFile.length === 0 && (
                <p className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xs">
                  ✓{" "}
                  {t.has("form.messages.byLawsUploaded")
                    ? t("form.messages.byLawsUploaded")
                    : "Document uploaded successfully"}
                </p>
              )}
              {uploadDocMutation.isPending && (
                <p className="text-xs font-mono text-[#1769AA]">
                  {t.has("form.messages.byLawsUploading")
                    ? t("form.messages.byLawsUploading")
                    : "Uploading document..."}
                </p>
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
                disabled={isSubmitting || uploadDocMutation.isPending}
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
              >
                {isSubmitting
                  ? t("buttons.saving")
                  : uploadDocMutation.isPending
                    ? t("buttons.uploading")
                    : t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}