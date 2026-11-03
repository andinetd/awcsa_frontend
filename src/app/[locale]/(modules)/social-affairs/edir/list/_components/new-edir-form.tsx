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
import { Plus, Edit, X, Paperclip, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useCreateEdirMutation,
  useUpdateEdirMutation,
  useUploadEdirDocumentMutation,
  useGetEdirCouncilsQuery,
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
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";

function normalizeLeadershipPosition(pos?: string): string {
  if (!pos) return "LEADER";
  const upper = pos.toUpperCase();
  if (upper === "LEADER" || upper === "SECRETARY" || upper === "TREASURER") return upper;
  if (pos.includes("ዳኛ") || pos.includes("ሰብሳቢ") || upper.includes("LEAD") || upper.includes("CHAIR")) return "LEADER";
  if (pos.includes("ጸሐፊ") || pos.includes("ፀሐፊ") || upper.includes("SEC")) return "SECRETARY";
  if (pos.includes("ገንዘብ") || upper.includes("TREAS") || upper.includes("CASH")) return "TREASURER";
  return "LEADER";
}

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
  const tp = useTranslations("social-affairs.edir.edir-members.positions");
  const safeT = (key: string, fallback: string): string => {
    try {
      return t.has(key as any) ? (t(key as any) as string) : fallback;
    } catch {
      return fallback;
    }
  };
  const [open, setOpen] = useState(false);
  const createMutation = useCreateEdirMutation();
  const updateMutation = useUpdateEdirMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!edirId;
  const { data: councils = [] } = useGetEdirCouncilsQuery();
  const { userSubCity, userWoreda } = useJurisdictionScope();

  const form = useForm<NewEdirSchemaType>({
    resolver: zodResolver(newEdirSchema) as any,
    defaultValues: {
      name: "",
      establishmentDate: new Date().toISOString().split("T")[0],
      edirType: "COMMUNITY",
      registerLevel: "WOREDA",
      subCity: userSubCity || "",
      woreda: userWoreda || "",
      houseNumber: "",
      specificLocation: "",
      members: { male: 0, female: 0, total: 0 },
      totalAssetValue: undefined,
      bankAccountNumber: "",
      monthlyPaymentDetails: "",
      additionalIncome: "",
      remark: "",
      leadershipMembers: [
        { fullName: "", position: "LEADER", phoneNumber: "" },
        { fullName: "", position: "SECRETARY", phoneNumber: "" },
        { fullName: "", position: "TREASURER", phoneNumber: "" },
      ],
      foundingMembers: [],
      assets: [],
      assetsAuditedByAuditCommittee: false,
      assetsApprovedByGeneralAssembly: false,
      byLawsDocId: undefined,
      documentIds: [],
      councilId: undefined,
    },
  });

  useEffect(() => {
    if (open && !initialData) {
      if (userSubCity && !form.getValues("subCity")) {
        form.setValue("subCity", userSubCity);
      }
      if (userWoreda && !form.getValues("woreda")) {
        form.setValue("woreda", userWoreda);
      }
    }
  }, [open, userSubCity, userWoreda, initialData, form]);

  const leadershipFields = useFieldArray({
    control: form.control,
    name: "leadershipMembers",
  });
  const assetFields = useFieldArray({
    control: form.control,
    name: "assets",
  });

  const uploadDocMutation = useUploadEdirDocumentMutation();
  const [byLawsFile, setByLawsFile] = useState<File[]>([]);
  const [additionalDocs, setAdditionalDocs] = useState<
    Array<{ id: number; fileName: string; type?: string }>
  >([]);
  const [uploadingAssetIdx, setUploadingAssetIdx] = useState<number | null>(null);
  const [uploadingAdditionalDoc, setUploadingAdditionalDoc] = useState(false);

  // Auto-compute total members from male + female
  const membersMale = form.watch("members.male");
  const membersFemale = form.watch("members.female");

  useEffect(() => {
    const total = Number(membersMale || 0) + Number(membersFemale || 0);
    form.setValue("members.total", total);
  }, [membersMale, membersFemale, form]);

  const handleByLawsSelect = (files: File[]) => {
    setByLawsFile(files);
    if (files.length > 0) {
      uploadDocMutation.mutate(files[0], {
        onSuccess: (doc) => {
          form.setValue("byLawsDocId", doc.id);
          toast.success(safeT("messages.byLawsUploaded", "Document uploaded successfully"));
        },
        onError: (err: any) => {
          toast.error(err?.message || safeT("messages.byLawsUploadError", "Failed to upload document"));
          setByLawsFile([]);
          form.setValue("byLawsDocId", undefined);
        },
      });
    } else {
      form.setValue("byLawsDocId", undefined);
    }
  };

  const handleAssetFileSelect = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAssetIdx(index);
    uploadDocMutation.mutate(
      {
        file,
        type: "ASSET_PROOF",
        description:
          form.getValues(`assets.${index}.description`) || "Asset supporting file",
      } as any,
      {
        onSuccess: (doc) => {
          form.setValue(`assets.${index}.documentId`, doc.id);
          form.setValue(`assets.${index}.fileName`, doc.fileName);
          toast.success(safeT("messages.assetFileUploaded", "Asset file attached successfully"));
          setUploadingAssetIdx(null);
        },
        onError: (err: any) => {
          toast.error(err?.message || safeT("messages.docUploadError", "Failed to upload document"));
          setUploadingAssetIdx(null);
        },
      }
    );
  };

  const handleRemoveAssetFile = (index: number) => {
    form.setValue(`assets.${index}.documentId`, null);
    form.setValue(`assets.${index}.fileName`, null);
  };

  const handleAdditionalDocSelect = (files: File[]) => {
    if (!files || files.length === 0) return;
    setUploadingAdditionalDoc(true);
    const file = files[0];
    uploadDocMutation.mutate(
      {
        file,
        type: "OTHER",
        description: "Registration supporting document",
      } as any,
      {
        onSuccess: (doc) => {
          setAdditionalDocs((prev) => [
            ...prev,
            { id: doc.id, fileName: doc.fileName, type: doc.type },
          ]);
          const currentIds = form.getValues("documentIds") || [];
          form.setValue("documentIds", [...currentIds, doc.id]);
          toast.success(safeT("messages.docUploaded", "Document attached successfully"));
          setUploadingAdditionalDoc(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || safeT("messages.docUploadError", "Failed to upload document"));
          setUploadingAdditionalDoc(false);
        },
      }
    );
  };

  const handleRemoveAdditionalDoc = (docId: number) => {
    setAdditionalDocs((prev) => prev.filter((d) => d.id !== docId));
    const currentIds = form.getValues("documentIds") || [];
    form.setValue("documentIds", currentIds.filter((id) => id !== docId));
  };

  // Populate form with initial data when available
  useEffect(() => {
    if (initialData) {
      const dateStr = initialData.establishmentDate
        ? new Date(initialData.establishmentDate).toISOString().split("T")[0]
        : "";

      let leaders: Array<{ fullName: string; position: string; phoneNumber?: string }> = [];
      if (initialData.leadershipMembers && initialData.leadershipMembers.length > 0) {
        leaders = initialData.leadershipMembers.map((lm) => ({
          fullName: lm.fullName,
          position: normalizeLeadershipPosition(lm.position),
          phoneNumber: lm.phoneNumber || "",
        }));
      } else if ((initialData as any).members && Array.isArray((initialData as any).members) && (initialData as any).members.length > 0) {
        leaders = (initialData as any).members.map((m: any) => ({
          fullName: m.fullName,
          position: normalizeLeadershipPosition(m.position),
          phoneNumber: m.phoneNumber || "",
        }));
      } else if (initialData.chairpersonName) {
        leaders = [
          {
            fullName: initialData.chairpersonName,
            position: "LEADER",
            phoneNumber: initialData.chairpersonPhone || "",
          },
        ];
        if (initialData.deputyChairpersonName) {
          leaders.push({
            fullName: initialData.deputyChairpersonName,
            position: "SECRETARY",
            phoneNumber: initialData.deputyChairpersonPhone || "",
          });
        }
      } else {
        leaders = [
          { fullName: "", position: "LEADER", phoneNumber: "" },
          { fullName: "", position: "SECRETARY", phoneNumber: "" },
          { fullName: "", position: "TREASURER", phoneNumber: "" },
        ];
      }

      const totalMale = (initialData.generalMale || 0) + (initialData.managementMale || 0);
      const totalFemale = (initialData.generalFemale || 0) + (initialData.managementFemale || 0);

      form.reset({
        name: initialData.name,
        establishmentDate: dateStr,
        edirType: (initialData.edirType as any) || "COMMUNITY",
        registerLevel: "WOREDA",
        subCity: initialData.subCity,
        woreda: initialData.woreda,
        houseNumber: initialData.houseNumber || "",
        specificLocation: initialData.specificLocation || "",
        members: {
          male: totalMale,
          female: totalFemale,
          total: totalMale + totalFemale,
        },
        totalAssetValue: initialData.totalAssetValue ? Number(initialData.totalAssetValue) : undefined,
        bankAccountNumber: initialData.bankAccountNumber || "",
        monthlyPaymentDetails: initialData.monthlyPaymentDetails || "",
        additionalIncome: initialData.additionalIncome || "",
        remark: initialData.remark || "",
        leadershipMembers: leaders,
        foundingMembers: [],
        assets:
          initialData.assets?.map((a) => ({
            type: a.type,
            category: a.category || "MOVABLE_EQUIPMENT",
            description: a.description,
            value: Number(a.value) || 0,
            documentId:
              a.documentId ?? (a.document ? a.document.id : undefined),
            fileName: a.document ? a.document.fileName : undefined,
          })) ?? [],
        assetsAuditedByAuditCommittee:
          initialData.assetsAuditedByAuditCommittee ?? false,
        assetsApprovedByGeneralAssembly:
          initialData.assetsApprovedByGeneralAssembly ?? false,
        byLawsDocId: initialData.byLawsDoc?.id ?? undefined,
        documentIds: initialData.documents?.map((d) => d.id) ?? [],
        councilId: initialData.councilId ?? undefined,
      });
      if (initialData.byLawsDoc) {
        setByLawsFile([]);
      }
      if (initialData.documents) {
        setAdditionalDocs(
          initialData.documents
            .filter((d) => d.id !== initialData.byLawsDoc?.id)
            .map((d) => ({ id: d.id, fileName: d.fileName, type: d.type }))
        );
      }
    }
  }, [initialData, form]);

  function onSubmit(values: NewEdirSchemaType) {
    const validLeaders = (values.leadershipMembers || []).filter(
      (m) => m.fullName && m.fullName.trim().length > 0,
    );
    const primaryLeader =
      validLeaders.find((m) => normalizeLeadershipPosition(m.position) === "LEADER") ||
      validLeaders[0];
    const deputyLeader =
      validLeaders.find((m) => normalizeLeadershipPosition(m.position) === "SECRETARY") ||
      validLeaders[1];

    const totalMale = Number(values.members?.male || 0);
    const totalFemale = Number(values.members?.female || 0);

    const apiPayload = {
      ...values,
      registerLevel: "WOREDA",
      totalAssetValue: values.totalAssetValue ? Number(values.totalAssetValue) : null,
      chairpersonName: primaryLeader?.fullName || null,
      chairpersonPhone: primaryLeader?.phoneNumber || null,
      deputyChairpersonName: deputyLeader?.fullName || null,
      deputyChairpersonPhone: deputyLeader?.phoneNumber || null,
      managementMale: 0,
      managementFemale: 0,
      generalMale: totalMale,
      generalFemale: totalFemale,
      members: {
        management: { male: 0, female: 0, total: 0 },
        general: { male: totalMale, female: totalFemale, total: totalMale + totalFemale },
      },
      councilId: values.councilId ? Number(values.councilId) : null,
      leadershipMembers: validLeaders.map((lm) => ({
        fullName: lm.fullName.trim(),
        position: normalizeLeadershipPosition(lm.position),
        phoneNumber: lm.phoneNumber || "",
      })),
      foundingMembers: validLeaders.map((lm) => ({
        fullName: lm.fullName.trim(),
        address: normalizeLeadershipPosition(lm.position),
      })),
      assets: values.assets.map((a) => ({
        type: a.type,
        category: a.category || "MOVABLE_EQUIPMENT",
        description: a.description,
        value: Number(a.value) || 0,
        documentId: a.documentId ? Number(a.documentId) : null,
      })),
      assetsAuditedByAuditCommittee: values.assetsAuditedByAuditCommittee,
      assetsApprovedByGeneralAssembly: values.assetsApprovedByGeneralAssembly,
      byLawsDocId: values.byLawsDocId ?? undefined,
      documentIds: values.documentIds || [],
    };

    if (isEditMode && edirId) {
      updateMutation.mutate(
        { id: edirId, data: apiPayload as any },
        {
          onSuccess: () => {
            setOpen(false);
            toast.success(safeT("messages.successUpdate", "Edir updated successfully"));
          },
        },
      );
    } else {
      createMutation.mutate(apiPayload as any, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast.success(safeT("messages.successCreate", "Edir registered successfully"));
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
            {safeT("buttons.register", "Register Edir")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            {isEditMode ? safeT("updateTitle", "Update Edir Association") : safeT("createTitle", "Register New Edir")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {isEditMode ? safeT("updateDesc", "Update the details of the Edir association.") : safeT("createDesc", "Enter the details of the new Edir association.")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {safeT("sections.basic", "Basic Information")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.name", "Edir Name")}</FormLabel>
                      <FormControl>
                        <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" placeholder={safeT("fields.name", "Edir Name")} {...field} />
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.date", "Establishment Date")}</FormLabel>
                      <FormControl>
                        <Input className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white" type="date" {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="edirType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {safeT("fields.edirType", "Edir Type")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                            <SelectValue placeholder={safeT("fields.edirType", "Edir Type")}>
                              {field.value
                                ? t.has(`edirTypes.${field.value}` as any)
                                  ? t(`edirTypes.${field.value}` as any)
                                  : field.value
                                : undefined}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xs border-[#E3E7EB]">
                          {(["COMMUNITY", "WOMENS", "WORKPLACE", "SPECIALIZED"] as const).map(
                            (type) => (
                              <SelectItem key={type} value={type} className="text-xs rounded-xs">
                                {t.has(`edirTypes.${type}` as any)
                                  ? t(`edirTypes.${type}` as any)
                                  : type}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="councilId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {safeT("fields.council", "Edir Council")}
                      </FormLabel>
                      <Select
                        onValueChange={(val) => {
                           field.onChange(val === "none" ? null : Number(val));
                        }}
                        value={field.value ? String(field.value) : "none"}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                            <SelectValue placeholder={safeT("fields.councilPlaceholder", "Select Council")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xs border-[#E3E7EB] max-h-56">
                          <SelectItem value="none" className="text-xs rounded-xs text-slate-500">
                            {safeT("fields.noCouncilOption", "None (Independent)")}
                          </SelectItem>
                          {councils.map((council) => (
                            <SelectItem
                              key={council.id}
                              value={String(council.id)}
                              className="text-xs rounded-xs"
                            >
                              {council.name} ({council.level})
                            </SelectItem>
                          ))}
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
                {safeT("sections.address", "Address")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="subCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.subCity", "Sub City")}</FormLabel>
                      <FormControl>
                        <SubCitySelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={safeT("fields.subCity", "Sub City")}
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.woreda", "Woreda")}</FormLabel>
                      <FormControl>
                        <WoredaSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          subCity={form.watch("subCity")}
                          placeholder={safeT("fields.woreda", "Woreda")}
                        />
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.houseNumber", "House Number")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={safeT("fields.houseNumber", "House Number")}
                          {...field}
                          value={field.value ?? ""}
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
                    <FormItem className="col-span-full">
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.location", "Specific Location (Optional)")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={safeT("fields.location", "Specific Location (Optional)")}
                          {...field}
                          value={field.value ?? ""}
                        />
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
                {safeT("sections.membership", "Membership Statistics")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="members.male"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {safeT("fields.male", "Male")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          type="number"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="members.female"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {safeT("fields.female", "Female")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          type="number"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="members.total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {safeT("fields.total", "Total")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-100 font-mono text-slate-700 font-bold"
                          type="number"
                          {...field}
                          value={Number(membersMale || 0) + Number(membersFemale || 0)}
                          disabled
                          readOnly
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Financials & Remarks */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {safeT("sections.financials", "Financials & Remarks")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="totalAssetValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">
                        {safeT("fields.totalCapital", "Total Capital / Wealth (ETB)")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white font-mono"
                          type="number"
                          placeholder={safeT("fields.totalCapital", "Total Capital / Wealth (ETB)")}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.bankAccount", "Bank Account Number")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white font-mono"
                          placeholder={safeT("fields.bankAccount", "Bank Account Number")}
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
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.contribution", "Monthly Contribution")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={safeT("fields.contribution", "Monthly Contribution")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.additionalIncome", "Additional Income (Optional)")}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                          placeholder={safeT("fields.additionalIncomePlaceholder", "e.g., Tent & chair rental, hall rental, shops...")}
                          {...field}
                          value={field.value || ""}
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
                    <FormLabel className="text-xs font-semibold text-slate-700">{safeT("fields.remarks", "Remarks")}</FormLabel>
                    <FormControl>
                      <Textarea className="text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white min-h-[70px]" placeholder={safeT("fields.remarks", "Remarks")} {...field} />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Leadership Members */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-[#E3E7EB] pb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                  {t.has("sections.leadershipMembers")
                    ? t("sections.leadershipMembers")
                    : t.has("sections.leadership")
                      ? t("sections.leadership")
                      : "Edir Leadership Members"}
                </h3>
              </div>
              <div className="space-y-2">
                {leadershipFields.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-start rounded-xs border border-[#E3E7EB] bg-slate-50/30 p-3"
                  >
                    <FormField
                      control={form.control}
                      name={`leadershipMembers.${index}.fullName`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t.has("fields.leaderFullName")
                              ? t("fields.leaderFullName")
                              : t.has("fields.founderName")
                                ? t("fields.founderName")
                                : "Full Name"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              placeholder={
                                t.has("fields.leaderFullName")
                                  ? t("fields.leaderFullName")
                                  : "Full Name"
                              }
                              {...f}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`leadershipMembers.${index}.position`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t.has("fields.leaderPosition")
                              ? t("fields.leaderPosition")
                              : "Position"}
                          </FormLabel>
                          <Select
                            onValueChange={f.onChange}
                            value={normalizeLeadershipPosition(f.value)}
                          >
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                                <SelectValue
                                  placeholder={
                                    t.has("fields.leaderPosition")
                                      ? t("fields.leaderPosition")
                                      : "Position"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xs border-[#E3E7EB]">
                              <SelectItem value="LEADER" className="text-xs rounded-xs">
                                {tp.has("LEADER") ? tp("LEADER") : "Edir Dagna / Leader"}
                              </SelectItem>
                              <SelectItem value="SECRETARY" className="text-xs rounded-xs">
                                {tp.has("SECRETARY") ? tp("SECRETARY") : "Tsehafi / Secretary"}
                              </SelectItem>
                              <SelectItem value="TREASURER" className="text-xs rounded-xs">
                                {tp.has("TREASURER") ? tp("TREASURER") : "Genzeb Yazh / Treasurer"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`leadershipMembers.${index}.phoneNumber`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                            {t.has("fields.leaderPhone")
                              ? t("fields.leaderPhone")
                              : "Phone Number"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                              placeholder="09..."
                              {...f}
                              value={f.value ?? ""}
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
                      onClick={() => leadershipFields.remove(index)}
                      disabled={leadershipFields.fields.length <= 1}
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
                    leadershipFields.append({ fullName: "", position: "LEADER", phoneNumber: "" })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.has("buttons.addLeader")
                    ? t("buttons.addLeader")
                    : t.has("buttons.addFounder")
                      ? t("buttons.addFounder")
                      : "Add Leader Member"}
                </Button>
              </div>
              {form.formState.errors.leadershipMembers?.root && (
                <p className="text-xs text-rose-600 font-mono">
                  {form.formState.errors.leadershipMembers.root.message}
                </p>
              )}
            </div>

            {/* Assets at registration (Directive Art 7.b) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {safeT("sections.assets", "Assets at Registration")}
              </h3>
              <div className="space-y-2">
                {assetFields.fields.map((field, index) => {
                  const currentDocId = form.watch(`assets.${index}.documentId`);
                  const currentFileName = form.watch(`assets.${index}.fileName`);

                  return (
                    <div
                      key={field.id}
                      className="rounded-xs border border-[#E3E7EB] bg-slate-50/30 p-3 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_130px_auto] gap-3 items-start">
                        <FormField
                          control={form.control}
                          name={`assets.${index}.type`}
                          render={({ field: f }) => (
                            <FormItem>
                              <FormLabel className="text-[11px] font-mono font-medium text-slate-500">
                                {safeT("fields.assetType", "Asset Type")}
                              </FormLabel>
                              <Select
                                onValueChange={f.onChange}
                                defaultValue={f.value}
                                value={f.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white">
                                    <SelectValue placeholder={safeT("fields.assetType", "Asset Type")}>
                                      {f.value
                                        ? safeT(`assetTypes.${f.value}`, f.value)
                                        : undefined}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xs border-[#E3E7EB]">
                                  <SelectItem value="CASH" className="text-xs rounded-xs">
                                    {safeT("assetTypes.CASH", "Cash")}
                                  </SelectItem>
                                  <SelectItem value="IN_KIND" className="text-xs rounded-xs">
                                    {safeT("assetTypes.IN_KIND", "In Kind")}
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
                                {safeT("fields.assetDescription", "Asset Description")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white"
                                  placeholder={safeT("fields.assetDescription", "Asset Description")}
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
                                {safeT("fields.assetValue", "Value (ETB)")}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-white font-mono"
                                  type="number"
                                  min="0"
                                  step="0.01"
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
                          onClick={() => assetFields.remove(index)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Optional Asset Supporting File */}
                      <div className="pt-2 border-t border-[#E3E7EB]/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] font-mono text-slate-600">
                            {safeT("fields.assetFile", "Supporting File")}:
                          </span>
                          {currentDocId ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <FileText className="w-3 h-3 text-emerald-600" />
                              <span className="max-w-[180px] truncate">
                                {currentFileName || `Document #${currentDocId}`}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveAssetFile(index)}
                                className="text-emerald-700 hover:text-rose-600 ml-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400 italic">
                              None
                            </span>
                          )}
                        </div>

                        <div>
                          {uploadingAssetIdx === index ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#1769AA]">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              {safeT("fields.uploading", "Uploading...")}
                            </span>
                          ) : !currentDocId ? (
                            <label className="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded-xs text-[11px] font-mono font-medium bg-white hover:bg-slate-100 border border-[#E3E7EB] text-slate-700 transition-colors">
                              <Paperclip className="w-3 h-3 text-slate-500" />
                              <span>{safeT("fields.attachFile", "Attach File")}</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleAssetFileSelect(index, e)}
                              />
                            </label>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] gap-1.5"
                  onClick={() =>
                    assetFields.append({
                      type: "CASH",
                      category: "MOVABLE_EQUIPMENT",
                      description: "",
                      value: 0,
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  {safeT("buttons.addAsset", "Add Asset")}
                </Button>
              </div>
            </div>

            {/* Audit & Assembly approval (Directive Art 7.b) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {safeT("sections.approvals", "Audit & Approval")}
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
                        <FormLabel className="text-xs font-medium text-slate-700 cursor-pointer">{safeT("fields.auditCommittee", "Assets counted by Audit Committee")}</FormLabel>
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
                        <FormLabel className="text-xs font-medium text-slate-700 cursor-pointer">{safeT("fields.generalAssembly", "Assets approved by General Assembly")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* By-laws & Registration Documents (Directive Art 7.e) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
                {safeT("sections.documents", "By-Laws & Registration Documents")}
              </h3>

              {/* Primary By-laws */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-mono font-semibold text-slate-700">
                  {safeT("fields.byLawsDoc", "By-Laws / Founding Document (የመተዳደሪያ ደንብ)")}
                </p>
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
                    ✓ {safeT("messages.byLawsUploaded", "By-laws uploaded successfully")}
                  </p>
                )}
                {uploadDocMutation.isPending &&
                  !uploadingAdditionalDoc &&
                  uploadingAssetIdx === null && (
                    <p className="text-xs font-mono text-[#1769AA]">
                      {safeT("messages.byLawsUploading", "Uploading by-laws...")}
                    </p>
                  )}
              </div>

              {/* Additional Registration Documents */}
              <div className="space-y-2 pt-2 border-t border-[#E3E7EB]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-mono font-semibold text-slate-700">
                      {safeT("fields.additionalDocuments", "Additional Registration Documents")}
                    </p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-xs text-[11px] font-mono font-medium bg-white hover:bg-slate-100 border border-[#E3E7EB] text-[#1769AA] transition-colors shadow-2xs">
                    {uploadingAdditionalDoc ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                    <span>{safeT("fields.attachFile", "Attach File")}</span>
                    <input
                      type="file"
                      className="hidden"
                      disabled={uploadingAdditionalDoc}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAdditionalDocSelect([e.target.files[0]]);
                        }
                      }}
                    />
                  </label>
                </div>

                {additionalDocs.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {additionalDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2 rounded-xs border border-[#E3E7EB] bg-slate-50/50 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileText className="w-3.5 h-3.5 text-[#1769AA] shrink-0" />
                          <span className="font-mono text-[11px] text-slate-800 truncate">
                            {doc.fileName}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0"
                          onClick={() => handleRemoveAdditionalDoc(doc.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
              <Button
                type="button"
                variant="outline"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
                onClick={() => setOpen(false)}
              >
                {safeT("buttons.cancel", "Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending || uploadDocMutation.isPending}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs"
              >
                {isPending
                  ? isEditMode
                    ? safeT("buttons.updating", "Updating...")
                    : safeT("buttons.registering", "Registering...")
                  : isEditMode
                    ? safeT("buttons.update", "Update Edir")
                    : safeT("buttons.register", "Register Edir")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
