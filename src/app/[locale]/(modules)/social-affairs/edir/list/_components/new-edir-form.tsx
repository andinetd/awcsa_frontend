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
import { Plus, Edit, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useCreateEdirMutation,
  useUpdateEdirMutation,
  useUploadEdirDocumentMutation,
} from "@/hooks/social-affairs";
import { newEdirSchema, NewEdirSchemaType } from "@/schemas/edir";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edir } from "@/api/social-affairs/edir";
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";

interface NewEdirFormProps {
  initialData?: Edir;
  edirId?: number;
  trigger?: React.ReactNode;
}

export default function NewEdirForm({
  initialData,
  edirId,
  trigger,
}: NewEdirFormProps) {
  const t = useTranslations("social-affairs.edir.form");
  const [open, setOpen] = useState(false);
  const createMutation = useCreateEdirMutation();
  const updateMutation = useUpdateEdirMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!edirId;

  const form = useForm<NewEdirSchemaType>({
    resolver: zodResolver(newEdirSchema) as any,
    defaultValues: {
      name: "",
      establishmentDate: new Date().toISOString().split("T")[0],
      registerLevel: "WOREDA",
      subCity: "",
      woreda: "",
      kebele: "",
      houseNumber: "",
      specificLocation: "",
      members: {
        management: { male: 0, female: 0, total: 0 },
        general: { male: 0, female: 0, total: 0 },
      },
      bankAccountNumber: "",
      monthlyPaymentDetails: "",
      remark: "",
      foundingMembers: [{ fullName: "", address: "" }],
      assets: [],
      assetsAuditedByAuditCommittee: false,
      assetsApprovedByGeneralAssembly: false,
      byLawsDocId: undefined,
    },
  });

  const foundingFields = useFieldArray({
    control: form.control,
    name: "foundingMembers",
  });
  const assetFields = useFieldArray({
    control: form.control,
    name: "assets",
  });

  const uploadDocMutation = useUploadEdirDocumentMutation();
  const [byLawsFile, setByLawsFile] = useState<File[]>([]);

  // Auto-compute totals from male + female
  const managementMale = form.watch("members.management.male");
  const managementFemale = form.watch("members.management.female");
  const generalMale = form.watch("members.general.male");
  const generalFemale = form.watch("members.general.female");

  useEffect(() => {
    const total = Number(managementMale || 0) + Number(managementFemale || 0);
    form.setValue("members.management.total", total);
  }, [managementMale, managementFemale, form]);

  useEffect(() => {
    const total = Number(generalMale || 0) + Number(generalFemale || 0);
    form.setValue("members.general.total", total);
  }, [generalMale, generalFemale, form]);

  const handleByLawsSelect = (files: File[]) => {
    setByLawsFile(files);
    if (files.length > 0) {
      uploadDocMutation.mutate(files[0], {
        onSuccess: (doc) => {
          form.setValue("byLawsDocId", doc.id);
          toast.success(t("messages.byLawsUploaded"));
        },
        onError: () => {
          toast.error(t("messages.byLawsUploadError"));
          setByLawsFile([]);
        },
      });
    }
  };

  // Populate form with initial data when available
  useEffect(() => {
    if (initialData) {
      const dateStr = initialData.establishmentDate
        ? new Date(initialData.establishmentDate).toISOString().split("T")[0]
        : "";

      form.reset({
        name: initialData.name,
        establishmentDate: dateStr,
        registerLevel: (initialData.registerLevel || "WOREDA") as any,
        subCity: initialData.subCity,
        woreda: initialData.woreda,
        kebele: initialData.kebele,
        houseNumber: initialData.houseNumber,
        specificLocation: initialData.specificLocation,
        members: {
          management: {
            male: initialData.managementMale || 0,
            female: initialData.managementFemale || 0,
            total:
              (initialData.managementMale || 0) +
              (initialData.managementFemale || 0),
          },
          general: {
            male: initialData.generalMale || 0,
            female: initialData.generalFemale || 0,
            total:
              (initialData.generalMale || 0) + (initialData.generalFemale || 0),
          },
        },
        bankAccountNumber: initialData.bankAccountNumber,
        monthlyPaymentDetails: initialData.monthlyPaymentDetails,
        remark: initialData.remark || "",
        foundingMembers:
          initialData.foundingMembers && initialData.foundingMembers.length > 0
            ? initialData.foundingMembers.map((fm) => ({
                fullName: fm.fullName,
                address: fm.address || "",
              }))
            : [{ fullName: "", address: "" }],
        assets:
          initialData.assets?.map((a) => ({
            type: a.type,
            description: a.description,
            value: Number(a.value) || 0,
          })) ?? [],
        assetsAuditedByAuditCommittee:
          initialData.assetsAuditedByAuditCommittee ?? false,
        assetsApprovedByGeneralAssembly:
          initialData.assetsApprovedByGeneralAssembly ?? false,
        byLawsDocId: initialData.byLawsDoc?.id ?? undefined,
      });
      if (initialData.byLawsDoc) {
        setByLawsFile([]);
      }
    }
  }, [initialData, form]);

  function onSubmit(values: NewEdirSchemaType) {
    const apiPayload = {
      ...values,
      managementMale: values.members.management.male,
      managementFemale: values.members.management.female,
      generalMale: values.members.general.male,
      generalFemale: values.members.general.female,
      foundingMembers: values.foundingMembers.map((fm) => ({
        fullName: fm.fullName,
        address: fm.address || "",
      })),
      assets: values.assets.map((a) => ({
        type: a.type,
        description: a.description,
        value: Number(a.value) || 0,
      })),
      assetsAuditedByAuditCommittee: values.assetsAuditedByAuditCommittee,
      assetsApprovedByGeneralAssembly: values.assetsApprovedByGeneralAssembly,
      byLawsDocId: values.byLawsDocId ?? undefined,
    };

    if (isEditMode && edirId) {
      updateMutation.mutate(
        { id: edirId, data: apiPayload as any },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success("Edir updated successfully");
          },
        },
      );
    } else {
      createMutation.mutate(apiPayload as any, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast.success("Edir created successfully");
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
          <Button className="h-8 text-xs font-semibold rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {t("buttons.register")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            {isEditMode ? t("updateTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {isEditMode ? t("updateDesc") : t("createDesc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.basic")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.name")}</FormLabel>
                      <FormControl>
                        <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("fields.name")} {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="establishmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.date")}</FormLabel>
                      <FormControl>
                        <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="date" {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registerLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.registerLevel")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xs border-[#E3E7EB]">
                          {(["WOREDA", "SUB_CITY", "CITY"] as const).map(
                            (level) => (
                              <SelectItem key={level} value={level} className="text-xs rounded-xs">
                                {t(`levels.${level}`)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.address")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.subCity")}</FormLabel>
                      <FormControl>
                        <SubCitySelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={t("fields.subCity")}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="woreda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.woreda")}</FormLabel>
                      <FormControl>
                        <WoredaSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          subCity={form.watch("subCity")}
                          placeholder={t("fields.woreda")}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kebele"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.kebele")}</FormLabel>
                      <FormControl>
                        <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("fields.kebele")} {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.houseNumber")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={t("fields.houseNumber")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specificLocation"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.location")}</FormLabel>
                      <FormControl>
                        <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={t("fields.location")} {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Members Stats */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.membership")}
              </h3>
              <div className="space-y-2">
                <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.managementMembers")}</FormLabel>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="members.management.male"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                          {t("fields.male")}
                        </FormLabel>
                        <FormControl>
                          <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.management.female"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                          {t("fields.female")}
                        </FormLabel>
                        <FormControl>
                          <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.management.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                          {t("fields.total")}
                        </FormLabel>
                        <FormControl>
                          <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-100 font-mono text-slate-600" type="number" {...field} disabled readOnly />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.generalMembers")}</FormLabel>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="members.general.male"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                          {t("fields.male")}
                        </FormLabel>
                        <FormControl>
                          <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.general.female"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                          {t("fields.female")}
                        </FormLabel>
                        <FormControl>
                          <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="members.general.total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                          {t("fields.total")}
                        </FormLabel>
                        <FormControl>
                          <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-100 font-mono text-slate-600" type="number" {...field} disabled readOnly />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Financials & Remarks */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.financials")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.bankAccount")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white font-mono"
                          placeholder={t("fields.bankAccount")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyPaymentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.contribution")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={t("fields.contribution")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-700">{t("fields.remarks")}</FormLabel>
                    <FormControl>
                      <Textarea className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white min-h-[70px]" placeholder={t("fields.remarks")} {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Founding Members (Directive Art 7.a) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.foundingMembers")}
              </h3>
              <div className="space-y-2">
                {foundingFields.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-start rounded-xs border border-[#E3E7EB] bg-slate-50/30 p-3"
                  >
                    <FormField
                      control={form.control}
                      name={`foundingMembers.${index}.fullName`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t("fields.founderName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              placeholder={t("fields.founderName")}
                              {...f}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`foundingMembers.${index}.address`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t("fields.founderAddress")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              placeholder={t("fields.founderAddress")}
                              {...f}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mt-5 rounded-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => foundingFields.remove(index)}
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
                    foundingFields.append({ fullName: "", address: "" })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("buttons.addFounder")}
                </Button>
              </div>
              {form.formState.errors.foundingMembers?.root && (
                <p className="text-xs text-rose-600 font-mono">
                  {form.formState.errors.foundingMembers.root.message}
                </p>
              )}
            </div>

            {/* Assets at registration (Directive Art 7.b) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.assets")}
              </h3>
              <div className="space-y-2">
                {assetFields.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start rounded-xs border border-[#E3E7EB] bg-slate-50/30 p-3"
                  >
                    <FormField
                      control={form.control}
                      name={`assets.${index}.type`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t("fields.assetType")}
                          </FormLabel>
                          <Select
                            onValueChange={f.onChange}
                            defaultValue={f.value}
                            value={f.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                                <SelectValue placeholder={t("fields.assetType")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xs border-[#E3E7EB]">
                              <SelectItem value="CASH" className="text-xs rounded-xs">
                                {t("assetTypes.CASH")}
                              </SelectItem>
                              <SelectItem value="IN_KIND" className="text-xs rounded-xs">
                                {t("assetTypes.IN_KIND")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`assets.${index}.description`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t("fields.assetDescription")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              placeholder={t("fields.assetDescription")}
                              {...f}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`assets.${index}.value`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t("fields.assetValue")}
                          </FormLabel>
                          <FormControl>
                            <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white font-mono" type="number" min="0" step="0.01" {...f} />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mt-5 rounded-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => assetFields.remove(index)}
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
                    assetFields.append({ type: "CASH", description: "", value: 0 })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("buttons.addAsset")}
                </Button>
              </div>
            </div>

            {/* Audit & Assembly approval (Directive Art 7.b) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.approvals")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="assetsAuditedByAuditCommittee"
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
                        <FormLabel className="text-xs font-medium text-slate-700 cursor-pointer">{t("fields.auditCommittee")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assetsApprovedByGeneralAssembly"
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
                        <FormLabel className="text-xs font-medium text-slate-700 cursor-pointer">{t("fields.generalAssembly")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* By-laws / founding document (Directive Art 7.e) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {t("sections.documents")}
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
                  ✓ {t("messages.byLawsUploaded")}
                </p>
              )}
              {uploadDocMutation.isPending && (
                <p className="text-xs font-mono text-[#1769AA]">
                  {t("messages.byLawsUploading")}
                </p>
              )}
            </div>

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
                    : t("buttons.registering")
                  : isEditMode
                    ? t("buttons.update")
                    : t("buttons.register")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
