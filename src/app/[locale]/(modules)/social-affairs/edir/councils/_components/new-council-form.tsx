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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldPlus, Edit, Plus, Trash2, UserPlus, Users, FileText, Building2, Check, Search, X } from "lucide-react";
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
  const [edirSearch, setEdirSearch] = useState("");
  const [onlyUnassigned, setOnlyUnassigned] = useState(true);

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
    associationIds: [],
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
        associationIds: initialData.memberEdirs?.map((m) => m.id) || [],
      });
      setByLawsFile([]);
      setEdirSearch("");
    }
    if (open && !initialData) {
      form.reset(defaultValues);
      setByLawsFile([]);
      setEdirSearch("");
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
      associationIds: values.associationIds || [],
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

  useEffect(() => {
    const current = form.getValues("associationIds") || [];
    if (current.length > 0 && allEdirs.length > 0) {
      const validIds = new Set(
        allEdirs
          .filter(
            (e: any) =>
              e.registerLevel === watchedLevel && e.status === "ACTIVE",
          )
          .map((e: any) => e.id),
      );
      const stillValid = current.filter((id) => validIds.has(id));
      if (stillValid.length !== current.length) {
        form.setValue("associationIds", stillValid, { shouldDirty: true });
      }
    }
  }, [watchedLevel, allEdirs, form]);

  const eligibleMemberEdirs = allEdirs.filter((e: any) => {
    // Only ACTIVE edirs can join a council
    if (e.status && e.status !== "ACTIVE") return false;
    // Must match council level
    if (e.registerLevel && e.registerLevel !== watchedLevel) return false;
    // Match location
    if (
      watchedSubCity &&
      e.subCity &&
      e.subCity.toLowerCase() !== watchedSubCity.toLowerCase()
    ) {
      return false;
    }
    if (
      watchedLevel === "WOREDA" &&
      watchedWoreda &&
      e.woreda &&
      String(e.woreda) !== String(watchedWoreda)
    ) {
      return false;
    }
    if (onlyUnassigned) {
      const isCurrentCouncil = initialData && e.councilId === initialData.id;
      if (e.councilId && !isCurrentCouncil) return false;
    }
    if (edirSearch.trim()) {
      const q = edirSearch.toLowerCase().trim();
      const nameMatch = (e.name || "").toLowerCase().includes(q);
      const regMatch = (e.registrationNumber || "").toLowerCase().includes(q);
      if (!nameMatch && !regMatch) return false;
    }
    return true;
  });

  const selectedAssociationIds = form.watch("associationIds") || [];

  const toggleAssociation = (id: number) => {
    const current = form.getValues("associationIds") || [];
    if (current.includes(id)) {
      form.setValue(
        "associationIds",
        current.filter((x) => x !== id),
        { shouldDirty: true },
      );
    } else {
      form.setValue("associationIds", [...current, id], { shouldDirty: true });
    }
  };

  const selectAllEligible = () => {
    const current = new Set(form.getValues("associationIds") || []);
    eligibleMemberEdirs.forEach((e: any) => {
      if (e.id) current.add(e.id);
    });
    form.setValue("associationIds", Array.from(current), { shouldDirty: true });
  };

  const clearAllEligible = () => {
    form.setValue("associationIds", [], { shouldDirty: true });
  };

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
        {trigger ? (
          trigger
        ) : (
          <Button className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
            {isEdit ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {isEdit ? t("buttons.edit") : t("buttons.add")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            {isEdit ? t("form.updateTitle") : t("form.createTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {isEdit ? t("form.updateDesc") : t("form.createDesc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("form.sections.general")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Council Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("form.fields.name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.name")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* Level */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("form.fields.level")}
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
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
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* Establishment Date */}
                <FormField
                  control={form.control}
                  name="establishmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("form.fields.establishmentDate")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address / Location */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("form.sections.location")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Sub City */}
                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem className={showWoreda ? "" : "sm:col-span-2 md:col-span-3"}>
                      <FormLabel className="text-xs font-semibold text-slate-700">
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
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* Woreda */}
                {showWoreda && (
                  <FormField
                    control={form.control}
                    name="woreda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">
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
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Specific Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("form.fields.address")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.address")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Leadership & Contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("form.sections.leadership")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="chairpersonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("form.fields.chairpersonName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.chairpersonName")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chairpersonPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("form.fields.chairpersonPhone")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.chairpersonPhone")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {t("form.fields.contactPhone")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.placeholders.contactPhone")}
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Leadership Members */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[#E3E7EB] pb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                  {t.has("form.sections.additionalLeadership")
                    ? t("form.sections.additionalLeadership")
                    : "Additional Leadership Members"}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {fields.length}{" "}
                  {t.has("leadershipDialog.memberCount")
                    ? t("leadershipDialog.memberCount", { count: fields.length })
                    : "members"}
                </span>
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

              <div className="space-y-2">
                {fields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2.5 items-start rounded-xs border border-[#E3E7EB] bg-slate-50/30 p-2.5"
                  >
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name={`leadershipMembers.${index}.fullName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t.has("form.fields.leaderName")
                              ? t("form.fields.leaderName")
                              : "Full Name"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.placeholders.leaderName")}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    {/* Role / Position */}
                    <FormField
                      control={form.control}
                      name={`leadershipMembers.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t.has("form.fields.leaderRole")
                              ? t("form.fields.leaderRole")
                              : "Role / Position"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              list="edir-council-role-suggestions"
                              placeholder={t("form.placeholders.leaderRole")}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name={`leadershipMembers.${index}.phoneNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t.has("form.fields.leaderPhone")
                              ? t("form.fields.leaderPhone")
                              : "Phone Number"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.placeholders.leaderPhone")}
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    {/* Representing Entity */}
                    {watchedLevel === "WOREDA" && (
                      <FormField
                        control={form.control}
                        name={`leadershipMembers.${index}.representedEntity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
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
                                    : "Select Edir"
                                }
                                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
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
                            <FormMessage className="text-[11px]" />
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
                            <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                              {t.has("form.fields.leaderRepresentedWoreda")
                                ? t("form.fields.leaderRepresentedWoreda")
                                : "Representing Woreda"}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
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
                            <FormMessage className="text-[11px]" />
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
                            <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                              {t.has("form.fields.leaderRepresentedSubCity")
                                ? t("form.fields.leaderRepresentedSubCity")
                                : "Representing Sub-City"}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
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
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Delete button (X icon) */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mt-5 rounded-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => remove(index)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] gap-1.5"
                  onClick={() =>
                    append({
                      fullName: "",
                      role: "",
                      phoneNumber: "",
                      address: "",
                      representedEntity: "",
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.has("form.buttons.addLeader")
                    ? t("form.buttons.addLeader")
                    : "Add Member"}
                </Button>
              </div>
            </div>

            {/* Member Edirs */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[#E3E7EB] pb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                  {t.has("form.sections.memberEdirs")
                    ? t("form.sections.memberEdirs")
                    : "Member Edirs"}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    {selectedAssociationIds.length}{" "}
                    {t.has("form.memberEdirs.selectedCount")
                      ? t("form.memberEdirs.selectedCount", {
                          count: selectedAssociationIds.length,
                        })
                      : "selected"}
                  </span>
                  {eligibleMemberEdirs.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <button
                        type="button"
                        onClick={selectAllEligible}
                        className="text-[11px] px-2 py-0.5 rounded-xs bg-slate-50 border border-[#E3E7EB] text-[#1769AA] hover:bg-[#E8F2FA] transition-colors cursor-pointer"
                      >
                        {t.has("form.memberEdirs.selectAll")
                          ? t("form.memberEdirs.selectAll")
                          : "Select All"}{" "}
                        ({eligibleMemberEdirs.length})
                      </button>
                      <button
                        type="button"
                        onClick={clearAllEligible}
                        disabled={selectedAssociationIds.length === 0}
                        className="text-[11px] px-2 py-0.5 rounded-xs bg-slate-50 border border-[#E3E7EB] text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        {t.has("form.memberEdirs.clearAll")
                          ? t("form.memberEdirs.clearAll")
                          : "Clear"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Search & Only Unassigned filter bar */}
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder={
                      t.has("form.memberEdirs.searchPlaceholder")
                        ? t("form.memberEdirs.searchPlaceholder")
                        : "Search eligible Edirs by name or reg #..."
                    }
                    value={edirSearch}
                    onChange={(e) => setEdirSearch(e.target.value)}
                    className="h-8 pl-8 pr-7 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                  />
                  {edirSearch && (
                    <button
                      type="button"
                      onClick={() => setEdirSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                  <Checkbox
                    className="rounded-xs data-[state=checked]:bg-[#1769AA] data-[state=checked]:border-[#1769AA]"
                    checked={onlyUnassigned}
                    onCheckedChange={(checked) => setOnlyUnassigned(!!checked)}
                  />
                  <span>
                    {t.has("form.memberEdirs.onlyUnassigned")
                      ? t("form.memberEdirs.onlyUnassigned")
                      : "Only show unassigned Edirs"}
                  </span>
                </label>
              </div>

              {/* Single-Line Member Edir Listing Table */}
              {eligibleMemberEdirs.length === 0 ? (
                <div className="rounded-xs border border-dashed border-[#E3E7EB] bg-white p-6 text-center space-y-1">
                  <p className="text-xs font-mono text-slate-500">
                    {t.has("form.memberEdirs.noEligible")
                      ? t("form.memberEdirs.noEligible")
                      : "No eligible active Edirs found for the selected level and location."}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    Tip: Make sure Sub-City and Woreda are selected above, or uncheck &quot;Only show unassigned Edirs&quot;.
                  </p>
                </div>
              ) : (
                <div className="rounded-xs border border-[#E3E7EB] bg-white overflow-hidden shadow-2xs">
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-50 border-b border-[#E3E7EB] z-10 text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider">
                        <tr>
                          <th className="w-10 px-3 py-2 text-center">
                            <span className="sr-only">Select</span>
                          </th>
                          <th className="px-3 py-2">
                            {t.has("form.memberEdirs.colName")
                              ? t("form.memberEdirs.colName")
                              : "Edir Name"}
                          </th>
                          <th className="px-3 py-2">
                            {t.has("form.memberEdirs.colRegNumber")
                              ? t("form.memberEdirs.colRegNumber")
                              : "Registration #"}
                          </th>
                          <th className="px-3 py-2">
                            {t.has("form.memberEdirs.colLocation")
                              ? t("form.memberEdirs.colLocation")
                              : "Location"}
                          </th>
                          <th className="px-3 py-2 text-right">
                            {t.has("form.memberEdirs.colCouncilStatus")
                              ? t("form.memberEdirs.colCouncilStatus")
                              : "Council Status"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {eligibleMemberEdirs.map((edir: any) => {
                          const isSelected = selectedAssociationIds.includes(edir.id);
                          const isOtherCouncil =
                            edir.council &&
                            (!initialData || edir.councilId !== initialData.id);
                          return (
                            <tr
                              key={edir.id}
                              onClick={() => toggleAssociation(edir.id)}
                              className={`cursor-pointer transition-colors select-none ${
                                isSelected
                                  ? "bg-[#E8F2FA] hover:bg-[#deecf8] text-[#0B1F3A]"
                                  : "hover:bg-slate-50 text-slate-700"
                              }`}
                            >
                              <td className="w-10 px-3 py-2 text-center whitespace-nowrap">
                                <span
                                  className={`inline-flex h-4 w-4 shrink-0 rounded-xs border items-center justify-center transition-colors ${
                                    isSelected
                                      ? "bg-[#1769AA] border-[#1769AA] text-white"
                                      : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  )}
                                </span>
                              </td>
                              <td className="px-3 py-2 font-sans font-semibold text-xs text-[#0B1F3A] whitespace-nowrap">
                                {edir.name}
                              </td>
                              <td className="px-3 py-2 text-[11px] text-slate-600 whitespace-nowrap">
                                {edir.registrationNumber ? `#${edir.registrationNumber}` : "—"}
                              </td>
                              <td className="px-3 py-2 text-[11px] text-slate-500 whitespace-nowrap">
                                {edir.subCity}
                                {edir.woreda ? ` • Woreda ${edir.woreda}` : ""}
                              </td>
                              <td className="px-3 py-2 text-right whitespace-nowrap">
                                {isOtherCouncil ? (
                                  <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                    {t.has("form.memberEdirs.alreadyInCouncil")
                                      ? t("form.memberEdirs.alreadyInCouncil", {
                                          name: edir.council.name,
                                        })
                                      : `In: ${edir.council.name}`}
                                  </span>
                                ) : (
                                  <span className="inline-block text-[10.5px] text-slate-400">
                                    {t.has("form.memberEdirs.unassigned")
                                      ? t("form.memberEdirs.unassigned")
                                      : "Unassigned"}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* By-laws / Documents */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
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
                  ✓ {t.has("form.messages.byLawsUploaded")
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

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
                onClick={() => setOpen(false)}
              >
                {t("buttons.dismiss")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || uploadDocMutation.isPending}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs"
              >
                {isSubmitting
                  ? t("buttons.saving")
                  : isEdit
                    ? t("buttons.edit")
                    : t("buttons.add")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}