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
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";

interface NewCouncilFormProps {
  initialData?: EdirCouncil;
  councilId?: number;
  trigger?: React.ReactNode;
}

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

  const { userSubCity, userWoreda, isWoreda, isSubCity } = useJurisdictionScope();
  const initialLevel: EdirLevel = isWoreda ? "WOREDA" : isSubCity ? "SUB_CITY" : "WOREDA";

  const defaultValues: NewEdirCouncilSchemaType = {
    name: "",
    level: initialLevel,
    subCity: userSubCity || "",
    woreda: userWoreda || "",
    establishmentDate: new Date().toISOString().slice(0, 10),
    contactPhone: "",
    address: "",
    leadershipMembers: [
      {
        fullName: "",
        role: "የእድር ዳኛ",
        phoneNumber: "",
        representedEntity: "",
      },
      {
        fullName: "",
        role: "ጸሐፊ",
        phoneNumber: "",
        representedEntity: "",
      },
    ],
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
      let members: CouncilLeadershipMember[] = [];

      if (
        Array.isArray(initialData.leadershipMembers) &&
        initialData.leadershipMembers.length > 0
      ) {
        members = initialData.leadershipMembers.map((m) => ({
          fullName: m.fullName || "",
          role: m.role || "አባል",
          phoneNumber: m.phoneNumber || "",
          address: m.address || "",
          representedEntity: m.representedEntity || "",
        }));
      } else {
        // Fallback for legacy councils with only scalar chairpersonName
        members = [
          {
            fullName: initialData.chairpersonName || "",
            role: "የእድር ዳኛ",
            phoneNumber: initialData.chairpersonPhone || "",
            representedEntity: "",
          },
          {
            fullName: "",
            role: "ጸሐፊ",
            phoneNumber: "",
            representedEntity: "",
          },
        ];
      }

      form.reset({
        name: initialData.name,
        level: initialData.level,
        subCity: initialData.subCity,
        woreda: initialData.woreda || "",
        establishmentDate: initialData.establishmentDate.slice(0, 10),
        contactPhone: initialData.contactPhone || "",
        address: initialData.address || "",
        leadershipMembers: members,
        byLawsDocId: (initialData as any)?.byLawsDoc?.id ?? undefined,
        associationIds: initialData.memberEdirs?.map((m) => m.id) || [],
      });
      setByLawsFile([]);
      setEdirSearch("");
    }
    if (open && !initialData) {
      form.reset({
        ...defaultValues,
        level: initialLevel,
        subCity: userSubCity || "",
        woreda: userWoreda || "",
      });
      setByLawsFile([]);
      setEdirSearch("");
    }
  }, [open, initialData, form, initialLevel, userSubCity, userWoreda]);

  useEffect(() => {
    if (open && !initialData) {
      if (userSubCity && !form.getValues("subCity")) {
        form.setValue("subCity", userSubCity);
      }
      if (userWoreda && !form.getValues("woreda")) {
        form.setValue("woreda", userWoreda);
      }
      if (isWoreda && form.getValues("level") !== "WOREDA") {
        form.setValue("level", "WOREDA");
      }
    }
  }, [open, userSubCity, userWoreda, isWoreda, initialData, form]);

  const onSubmit = async (values: NewEdirCouncilSchemaType) => {
    const rawMembers = values.leadershipMembers || [];
    const validMembers: CouncilLeadershipMember[] = rawMembers
      .filter((m) => m.fullName && m.fullName.trim() !== "")
      .map((m) => ({
        fullName: m.fullName!.trim(),
        role: m.role?.trim() || "አባል",
        phoneNumber: m.phoneNumber?.trim() || undefined,
        address: m.address?.trim() || undefined,
        representedEntity: m.representedEntity?.trim() || undefined,
      }));

    const chair =
      validMembers.find(
        (m) =>
          m.role === "የእድር ዳኛ" ||
          m.role?.toLowerCase().includes("dagna") ||
          m.role?.toLowerCase().includes("chair")
      ) || validMembers[0];

    const payload: EdirCouncilPayload = {
      name: values.name,
      level: values.level as EdirLevel,
      subCity: values.subCity,
      woreda: values.woreda || undefined,
      establishmentDate: values.establishmentDate,
      chairpersonName: chair?.fullName || undefined,
      chairpersonPhone: chair?.phoneNumber || undefined,
      contactPhone: values.contactPhone || undefined,
      address: values.address || undefined,
      leadershipMembers: validMembers,
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

  const currentSubCityObj = (subCities || []).find(
    (s) => (s?.name || "").trim().toLowerCase() === (watchedSubCity || "").trim().toLowerCase()
  );
  const subCityWoredas = currentSubCityObj?.woredas?.map((w) => String(w.code)) || [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14",
  ];

  const safeAllEdirs = Array.isArray(allEdirs) ? allEdirs : [];

  const candidateEdirs = safeAllEdirs.filter((e: any) => {
    if (!e) return false;
    if (watchedSubCity && e.subCity && (e.subCity || "").trim().toLowerCase() !== (watchedSubCity || "").trim().toLowerCase()) {
      return false;
    }
    if (watchedWoreda && e.woreda && String(e.woreda) !== String(watchedWoreda)) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const current = form.getValues("associationIds") || [];
    if (current.length > 0 && safeAllEdirs.length > 0) {
      const validIds = new Set(
        safeAllEdirs
          .filter(
            (e: any) =>
              e?.registerLevel === watchedLevel && e?.status === "ACTIVE",
          )
          .map((e: any) => e.id),
      );
      const stillValid = current.filter((id) => validIds.has(id));
      if (stillValid.length !== current.length) {
        form.setValue("associationIds", stillValid, { shouldDirty: true });
      }
    }
  }, [watchedLevel, safeAllEdirs, form]);

  const eligibleMemberEdirs = safeAllEdirs.filter((e: any) => {
    if (!e) return false;
    // Only ACTIVE edirs can join a council
    if (e.status && e.status !== "ACTIVE") return false;
    // Must match council level
    if (e.registerLevel && e.registerLevel !== watchedLevel) return false;
    // Match location
    if (
      watchedSubCity &&
      e.subCity &&
      (e.subCity || "").trim().toLowerCase() !== (watchedSubCity || "").trim().toLowerCase()
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

  const renderRepresentedEntityField = (
    name: any,
    labelOverride?: string,
  ) => {
    const label =
      labelOverride ||
      (watchedLevel === "WOREDA"
        ? t("form.fields.leaderRepresentedEdir")
        : watchedLevel === "SUB_CITY"
        ? t("form.fields.leaderRepresentedWoreda")
        : t("form.fields.leaderRepresentedSubCity"));

    if (watchedLevel === "WOREDA") {
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {label}
              </FormLabel>
              <FormControl>
                <Input
                  list="edir-council-candidate-edirs"
                  placeholder={t("form.placeholders.leaderRepresentedEdir")}
                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white focus:bg-white"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
      );
    }

    if (watchedLevel === "SUB_CITY") {
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {label}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                    <SelectValue
                      placeholder={t("form.placeholders.leaderRepresentedWoreda")}
                    >
                      {field.value ? `Woreda ${field.value}` : undefined}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-56">
                  {subCityWoredas
                    .filter((wCode) => !!wCode)
                    .map((wCode) => (
                      <SelectItem key={wCode} value={String(wCode)} className="text-xs">
                        Woreda {wCode}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
      );
    }

    if (watchedLevel === "CITY") {
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-slate-700">
                {label}
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                    <SelectValue
                      placeholder={t("form.placeholders.leaderRepresentedSubCity")}
                    >
                      {field.value ? getSubCityLabel(field.value) : undefined}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-56">
                  {(subCities || [])
                    .filter((sc) => !!sc?.name)
                    .map((sc) => (
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
      );
    }

    return null;
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
                  render={({ field }) => {
                    const availableLevels: EdirLevel[] = isWoreda
                      ? ["WOREDA"]
                      : isSubCity
                      ? ["WOREDA", "SUB_CITY"]
                      : ["WOREDA", "SUB_CITY", "CITY"];

                    return (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700">
                          {t("form.fields.level")}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isWoreda}
                        >
                          <FormControl>
                            <SelectTrigger className={`h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white ${isWoreda ? "bg-slate-100 cursor-not-allowed" : ""}`}>
                              <SelectValue placeholder={t("form.fields.level")}>
                                {field.value ? t(`level.${field.value}` as any) : undefined}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xs border-[#E3E7EB]">
                            {availableLevels.map((level) => (
                              <SelectItem key={level} value={level} className="text-xs font-mono">
                                {t(`level.${level}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    );
                  }}
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

            {/* Datalists for Candidate Edirs and Role Suggestions */}
            <datalist id="edir-council-candidate-edirs">
              {candidateEdirs
                .filter((e: any) => !!e?.name)
                .map((e: any) => (
                  <option key={e.id} value={e.name}>
                    {e.name} {e.woreda ? `(Woreda ${e.woreda})` : ""}
                  </option>
                ))}
            </datalist>
            <datalist id="edir-council-member-role-suggestions">
              <option value="የእድር ዳኛ" />
              <option value="ጸሐፊ" />
              <option value="አባል" />
              <option value="ምክትል እድር ዳኛ" />
              <option value="ምክትል ጸሐፊ" />
            </datalist>

            {/* Council Leadership & Members */}
            <div className="space-y-3">
              <div className="border-b border-[#E3E7EB] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                  {t("form.sections.leadership")}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {t.has("form.sections.leadershipHelp")
                    ? t("form.sections.leadershipHelp")
                    : "Edir Dagna, Tsehafi, and optional additional members"}
                </p>
              </div>

              <div className="space-y-2.5">
                {fields.map((fieldItem, index) => {
                  const roleValue = form.watch(`leadershipMembers.${index}.role`);

                  return (
                    <div
                      key={fieldItem.id}
                      className="rounded-xs border border-[#E3E7EB] bg-slate-50/30 p-3 space-y-2.5 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs ${
                              roleValue === "የእድር ዳኛ" || (!roleValue && index === 0)
                                ? "bg-[#0B1F3A] text-white"
                                : roleValue === "ጸሐፊ" || (!roleValue && index === 1)
                                ? "bg-[#1769AA] text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {roleValue || `Member #${index + 1}`}
                          </span>
                        </div>

                        {fields.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xs cursor-pointer"
                            onClick={() => remove(index)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 items-start">
                        {/* Full Name */}
                        <FormField
                          control={form.control}
                          name={`leadershipMembers.${index}.fullName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px] font-mono font-medium text-slate-600">
                                {t.has("form.fields.leaderName")
                                  ? t("form.fields.leaderName")
                                  : "Full Name"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={
                                    index === 0
                                      ? t("form.placeholders.chairpersonName")
                                      : index === 1
                                      ? t("form.placeholders.secretaryName")
                                      : t("form.placeholders.leaderName")
                                  }
                                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white focus:bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[11px]" />
                            </FormItem>
                          )}
                        />

                        {/* Role */}
                        <FormField
                          control={form.control}
                          name={`leadershipMembers.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[11px] font-mono font-medium text-slate-600">
                                {t.has("form.fields.leaderRole")
                                  ? t("form.fields.leaderRole")
                                  : "Role"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  list="edir-council-member-role-suggestions"
                                  placeholder={t("form.placeholders.leaderRole")}
                                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white focus:bg-white"
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
                              <FormLabel className="text-[11px] font-mono font-medium text-slate-600">
                                {t.has("form.fields.leaderPhone")
                                  ? t("form.fields.leaderPhone")
                                  : "Phone"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("form.placeholders.leaderPhone")}
                                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white focus:bg-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[11px]" />
                            </FormItem>
                          )}
                        />

                        {/* Represented Entity */}
                        <div>
                          {renderRepresentedEntityField(
                            `leadershipMembers.${index}.representedEntity`
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Leadership / Member Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-xs border-[#E3E7EB] text-[#0B1F3A] hover:bg-[#F7F8FA] gap-1 font-medium cursor-pointer"
                  onClick={() =>
                    append({
                      fullName: "",
                      role: "የእድር ዳኛ",
                      phoneNumber: "",
                      address: "",
                      representedEntity: "",
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5 text-[#0B1F3A]" />
                  <span>
                    {t.has("form.buttons.addEdirDagna")
                      ? t("form.buttons.addEdirDagna")
                      : "Add Edir Dagna"}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-xs border-[#E3E7EB] text-[#1769AA] hover:bg-[#F7F8FA] gap-1 font-medium cursor-pointer"
                  onClick={() =>
                    append({
                      fullName: "",
                      role: "ጸሐፊ",
                      phoneNumber: "",
                      address: "",
                      representedEntity: "",
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>
                    {t.has("form.buttons.addTsehafi")
                      ? t("form.buttons.addTsehafi")
                      : "Add Tsehafi"}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] gap-1 font-medium cursor-pointer"
                  onClick={() =>
                    append({
                      fullName: "",
                      role: "አባል",
                      phoneNumber: "",
                      address: "",
                      representedEntity: "",
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {t.has("form.buttons.addMember")
                      ? t("form.buttons.addMember")
                      : "Add Member"}
                  </span>
                </Button>
              </div>

              {/* Office Contact Phone */}
              <div className="pt-1">
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