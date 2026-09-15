"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, XCircle, ShieldCheck, FileUp, X } from "lucide-react";
import { toast } from "sonner";
import {
  registerDisabledFormSchema,
  registerElderlyFormSchema,
  RegisterDisabledFormValues,
  RegisterElderlyFormValues,
  faydaIdSchema,
} from "@/schemas/srs-beneficiaries";
import {
  useRegisterDisabled,
  useRegisterElderly,
  useFaydaVerify,
} from "@/hooks/beneficiaries/srs-hooks";
import { BeneficiaryType } from "@/api/beneficiaries/types";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";

const TRAINING_OPTIONS = [
  "AGRICULTURE",
  "BUSINESS",
  "HOTEL_HOSPITALITY",
  "HOUSE_CONSTRUCTION",
  "AUTOMOTIVE",
  "ELECTRICITY",
  "ICT",
  "MUNICIPALITY_ADMIN",
  "ROAD_CONSTRUCTION",
  "AGRO_PROCESSING",
  "FURNITURE_MAKING",
  "TEXTILE_GARMENT",
  "LEATHER_WORK",
  "METAL_WORKING",
  "OTHER",
] as const;

const SEX_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "EMPLOYED", label: "Employed" },
  { value: "UNEMPLOYED", label: "Unemployed" },
];

const MARITAL_OPTIONS = [
  { value: "MARRIED", label: "Married" },
  { value: "UNMARRIED", label: "Unmarried" },
  { value: "DIVORCED", label: "Divorced" },
  { value: "WIDOWED", label: "Widowed" },
];

const WORKPLACE_OPTIONS = [
  { value: "OWN_PRIVATE", label: "Own / Private" },
  { value: "KEBELE_PUBLIC", label: "Kebele / Public" },
  { value: "RENTED", label: "Rented" },
];

const SEVERITY_OPTIONS = [
  { value: "MILD", label: "Mild" },
  { value: "MODERATE", label: "Moderate" },
  { value: "SEVERE", label: "Severe" },
  { value: "PROFOUND", label: "Profound" },
];

const DEFAULT_VALUES: any = {
  faydaId: "",
  cityIdNumber: "",
  firstName: "",
  lastName: "",
  grandfatherName: "",
  phoneNumber: "",
  age: undefined,
  dateOfBirth: "",
  sex: undefined,
  educationLevel: "",
  occupation: "",
  employmentStatus: undefined,
  maritalStatus: undefined,
  familyMembersCount: 0,
  address: "",
  subCity: "",
  woreda: "",
  zone: "",
  block: "",
  houseNumber: "",
  preferredTraining1: undefined,
  preferredTraining2: undefined,
  preferredTraining3: undefined,
  previousTraining: false,
  previousProfession: "",
  workplaceCondition: undefined,
  previousSupport: "",
  supportConfirmed: false,
  requiredSupportType: "",
  disabilityType: "",
  disabilitySeverity: undefined,
  cause: "",
  requiresPhysicalAssistance: false,
  requiredAssistiveDevice: "",
  otherSupportRequirements: "",
  documentName: "",
  documentBase64: "",
};

interface BeneficiaryFormBodyProps {
  type: BeneficiaryType;
  onSuccess?: () => void;
  submitLabel?: string;
}

export function BeneficiaryFormBody({
  type,
  onSuccess,
  submitLabel,
}: BeneficiaryFormBodyProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.registration");
  const tSrs = useTranslations("social-affairs.elderlyAndDisabled.srs");
  const [faydaStatus, setFaydaStatus] = useState<"none" | "valid" | "invalid">(
    "none",
  );

  const schema =
    type === "DISABLED" ? registerDisabledFormSchema : registerElderlyFormSchema;
  type FormValues =
    | RegisterElderlyFormValues
    | RegisterDisabledFormValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: DEFAULT_VALUES,
  });

  const registerElderly = useRegisterElderly();
  const registerDisabled = useRegisterDisabled();
  const faydaVerify = useFaydaVerify();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const faydaValue = form.watch("faydaId");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    form.setValue("documentName", file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      form.setValue("documentBase64", base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    form.setValue("documentName", "");
    form.setValue("documentBase64", "");
  };

  useEffect(() => {
    if (!faydaValue) {
      setFaydaStatus("none");
      return;
    }
    const result = faydaIdSchema.safeParse(faydaValue);
    setFaydaStatus(result.success ? "valid" : "invalid");
  }, [faydaValue]);

  const handleFaydaVerify = async () => {
    if (!faydaValue) return;
    try {
      const result = await faydaVerify.mutateAsync(faydaValue);
      if (result.verified) {
        toast.success(tSrs("faydaVerified"));
        if (result.fullName) {
          const [first, ...rest] = result.fullName.split(" ");
          form.setValue("firstName", first);
          form.setValue("lastName", rest.join(" "));
        }
      } else {
        toast.error(
          tSrs("faydaUnverified") + (result.reason ? `: ${result.reason}` : ""),
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "Fayda verification failed");
    }
  };

  const onSubmit = (values: FormValues) => {
    const payload = { ...values } as any;
    const mutation =
      type === "DISABLED" ? registerDisabled : registerElderly;
    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(tSrs("registerSuccess"));
        form.reset(DEFAULT_VALUES);
        setSelectedFile(null);
        setFaydaStatus("none");
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error?.message || tSrs("registrationFailed"));
      },
    });
  };

  const isPending = registerElderly.isPending || registerDisabled.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {t("sections.basicInfo")}
            </h3>
            <FormField
              control={form.control}
              name="faydaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    {tSrs("faydaId")} *
                    {faydaStatus === "valid" && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {faydaStatus === "invalid" && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="e.g. 1234567890123456"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={faydaStatus !== "valid" || faydaVerify.isPending}
                      onClick={handleFaydaVerify}
                      title={tSrs("verifyFayda")}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cityIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("cityId")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. ADDIS-1234"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.firstName")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.firstName")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.lastName")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.lastName")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grandfatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grandfather Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Grandfather's name"
                      {...field}
                      value={field.value ?? ""}
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
                    <Input
                      placeholder={t("placeholders.phone")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("age")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="65"
                        {...field}
                        value={(field.value as any) ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("sex")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SEX_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.dob")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {t("sections.details", {
                type: type === "DISABLED" ? t("disabled") : t("elderly"),
              })}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="subCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("subCity")}</FormLabel>
                    <FormControl>
                      <SubCitySelect
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        placeholder={tSrs("subCity")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="woreda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("woreda")}</FormLabel>
                    <FormControl>
                      <WoredaSelect
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        subCity={form.watch("subCity") as string}
                        placeholder={tSrs("woreda")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("zone")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSrs("zone")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="block"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("block")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSrs("block")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("houseNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSrs("houseNumber")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("employmentStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EMPLOYMENT_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("maritalStatus")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MARITAL_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.education")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.education")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.occupation")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.occupation")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="familyMembersCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.familyCount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={(field.value as any) ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {type === "DISABLED" && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Disability Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="disabilityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.disabilityType")} *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders.disabilityType")}
                        {...field}
                        value={(field.value as any) ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disabilitySeverity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SEVERITY_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="cause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.cause")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.cause")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requiredAssistiveDevice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("requiredAssistiveDevice")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Wheelchair, Braille display"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requiresPhysicalAssistance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0 pt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">
                      {tSrs("requiresPhysicalAssistance")}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="otherSupportRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("otherSupportRequirements")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other needs..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Supporting Document / File Attachment (Optional) */}
            <div className="space-y-2 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/50">
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FileUp className="w-4 h-4 text-primary" />
                Supporting Document / Medical Evidence (Optional)
              </FormLabel>
              <p className="text-xs text-slate-500">
                Attach medical report, disability certificate, or supporting letter (PDF, PNG, JPG, DOCX - max 10MB)
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileChange}
                  className="bg-white text-xs file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFile}
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              {selectedFile && (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  ✓ Ready to upload: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Training & Workplace
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="preferredTraining1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("preferredTraining1")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="1st" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRAINING_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredTraining2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("preferredTraining2")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="2nd" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRAINING_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredTraining3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("preferredTraining3")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="3rd" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRAINING_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="workplaceCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("workplaceCondition")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORKPLACE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="previousProfession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("previousProfession")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Trade or profession"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="previousSupport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSrs("previousSupport")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any support previously provided..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supportConfirmed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">
                  {tSrs("supportConfirmed")}
                </FormLabel>
              </FormItem>
            )}
          />
          {type === "ELDERLY" && (
            <FormField
              control={form.control}
              name="requiredSupportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("requiredSupportType")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Allowance, Medical, Training"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
          >
            {t("buttons.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitLabel ?? t("registerNew")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
