"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  DISABILITY_CATEGORIES,
  getSubTypesForCategory,
  getCategoryForSubType,
  getDisabilityDisplayLabel,
  DisabilityCategoryKey,
} from "@/constants/disability-classification";
import {
  getWorkSectorOptions,
  getWorkSectorDisplayLabel,
} from "@/constants/work-sectors";
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
import Link from "next/link";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileUp,
  X,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import {
  registerDisabledFormSchema,
  registerElderlyFormSchema,
  RegisterDisabledFormValues,
  RegisterElderlyFormValues,
  faydaIdSchema,
  parseFullName,
} from "@/schemas/srs-beneficiaries";
import {
  useRegisterDisabled,
  useRegisterElderly,
  useFaydaVerify,
} from "@/hooks/beneficiaries/srs-hooks";
import { calculateAge } from "@/lib/utils";
import { BeneficiaryType } from "@/api/beneficiaries/types";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";
import { useJurisdictionScope } from "@/hooks/use-jurisdiction-scope";
import {
  CrossModuleConflictDialog,
  CrossModuleClientData,
} from "@/components/shared/cross-module-conflict-dialog";

const SEX_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "NONE", labelAm: "ያልተማረ/ች", labelEn: "None / Illiterate" },
  { value: "PRIMARY", labelAm: "የመጀመሪያ ደረጃ (1-8)", labelEn: "Primary School (1-8)" },
  { value: "SECONDARY", labelAm: "ሁለተኛ ደረጃ (9-12)", labelEn: "Secondary School (9-12)" },
  { value: "CERTIFICATE", labelAm: "ሰርተፊኬት / ቴክኒክና ሙያ", labelEn: "Certificate / TVET" },
  { value: "DIPLOMA", labelAm: "ዲፕሎማ", labelEn: "Diploma" },
  { value: "BACHELOR", labelAm: "የመጀመሪያ ዲግሪ", labelEn: "Bachelor's Degree" },
  { value: "MASTERS", labelAm: "ሁለተኛ ዲግሪ (ማስተርስ)", labelEn: "Master's Degree" },
  { value: "DOCTORATE", labelAm: "ዶክትሬት (PhD)", labelEn: "Doctorate (PhD)" },
  { value: "OTHER", labelAm: "ሌላ", labelEn: "Other" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "EMPLOYED", label: "Has Work" },
  { value: "UNEMPLOYED", label: "No Work" },
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

const CAREGIVER_SUPPORT_OPTIONS = [
  "CAREGIVER_ALLOWANCE",
  "AUTISM_CENTER_REFERRAL",
  "PSYCHOSOCIAL_COUNSELING",
  "RESPITE_CARE",
  "EDUCATION_COOPERATION",
  "OTHER",
] as const;

export const ASSISTIVE_DEVICE_OPTIONS = [
  { value: "NONE", labelAm: "ምንም (አያስፈልግም)", labelEn: "None / Not Required" },
  { value: "ዊልቸር (Wheelchair)", labelAm: "ዊልቸር (Wheelchair)", labelEn: "Wheelchair" },
  { value: "ክራንች (Crutches)", labelAm: "ክራንች (Crutches)", labelEn: "Crutches" },
  { value: "ኬን / ነጭ በትር (White Cane)", labelAm: "ኬን / ነጭ በትር (White Cane)", labelEn: "White Cane" },
  { value: "ማዳመጫ (Hearing Aid)", labelAm: "ማዳመጫ (Hearing Aid)", labelEn: "Hearing Aid" },
  { value: "ብሬስ (Orthopedic Brace)", labelAm: "ብሬስ (Orthopedic Brace)", labelEn: "Orthopedic Brace" },
  { value: "መነጽር (Eyeglasses)", labelAm: "መነጽር (Eyeglasses)", labelEn: "Eyeglasses" },
  { value: "ሰው ሰራሽ አካል (Prosthetic / Artificial Limb)", labelAm: "ሰው ሰራሽ አካል (Prosthetic)", labelEn: "Prosthetic / Artificial Limb" },
  { value: "ተጓዥ ሮሌተር / ዎከር (Walker / Rollator)", labelAm: "ተጓዥ ሮሌተር / ዎከር (Walker)", labelEn: "Walker / Rollator" },
  { value: "OTHER", labelAm: "ሌላ (Other - እባክዎ ይጥቀሱ)", labelEn: "Other (Please specify)" },
];

export function AssistiveDeviceSelect({
  value,
  onChange,
  locale,
  onAutoCheckPhysicalAssistance,
}: {
  value: string;
  onChange: (val: string) => void;
  locale: string;
  onAutoCheckPhysicalAssistance?: () => void;
}) {
  const isNone = !value || value.trim() === "" || value === "NONE";

  const matchedOption = ASSISTIVE_DEVICE_OPTIONS.find(
    (opt) => opt.value !== "NONE" && opt.value !== "OTHER" && opt.value === value
  ) || ASSISTIVE_DEVICE_OPTIONS.find(
    (opt) =>
      opt.value !== "NONE" &&
      opt.value !== "OTHER" &&
      value &&
      (opt.value.toLowerCase().includes(value.toLowerCase()) ||
        value.toLowerCase().includes(opt.value.split(" ")[0].toLowerCase()))
  );

  const [mode, setMode] = useState<string>(() => {
    if (isNone) return "NONE";
    if (matchedOption) return matchedOption.value;
    return "OTHER";
  });

  const [customText, setCustomText] = useState<string>(() => {
    if (!isNone && !matchedOption) return value;
    return "";
  });

  useEffect(() => {
    if (isNone) {
      setMode("NONE");
    } else if (matchedOption) {
      setMode(matchedOption.value);
    } else {
      setMode("OTHER");
      setCustomText(value);
    }
  }, [value, isNone, matchedOption]);

  const handleSelect = (val: string) => {
    setMode(val);
    if (val === "NONE") {
      onChange("");
      setCustomText("");
    } else if (val === "OTHER") {
      onChange(customText);
    } else {
      onChange(val);
      setCustomText("");
      if (
        (val.includes("ዊልቸር") || val.includes("ክራንች") || val.includes("Wheelchair") || val.includes("Crutches")) &&
        onAutoCheckPhysicalAssistance
      ) {
        onAutoCheckPhysicalAssistance();
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomText(text);
    onChange(text);
  };

  return (
    <div className="space-y-2">
      <Select value={mode} onValueChange={handleSelect}>
        <SelectTrigger className="h-9 text-xs rounded-xs border-[#E3E7EB] bg-white">
          <SelectValue placeholder={locale === "am" ? "የድጋፍ መሳሪያ ይምረጡ..." : "Select assistive device..."} />
        </SelectTrigger>
        <SelectContent className="rounded-xs border-[#E3E7EB]">
          {ASSISTIVE_DEVICE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs rounded-xs">
              {locale === "am" ? opt.labelAm : opt.labelEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {mode === "OTHER" && (
        <div className="space-y-1">
          <Input
            value={customText}
            onChange={handleTextChange}
            placeholder={
              locale === "am"
                ? "እባክዎ የሚፈለገውን የድጋፍ መሳሪያ ዓይነት እዚህ ይጻፉ..."
                : "Please specify the required assistive device..."
            }
            className="h-8 text-xs font-mono rounded-xs border-[#1769AA]/40 focus-visible:ring-1 focus-visible:ring-[#1769AA]"
            autoFocus
          />
          <span className="text-[10px] text-slate-500 font-mono block">
            {locale === "am"
              ? "የሚፈለገውን ልዩ የድጋፍ መሳሪያ ስም ያስገቡ (ምሳሌ፡ የአልጋ ማንሻ፣ ልዩ ጫማ...)"
              : "Specify custom assistive equipment (e.g. Bed lifter, orthopedic shoes...)"}
          </span>
        </div>
      )}
    </div>
  );
}

const DEFAULT_VALUES: any = {
  faydaId: "",
  fullName: "",
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
  disabilityCategory: "",
  disabilityType: "",
  disabilitySeverity: undefined,
  cause: "",
  requiresPhysicalAssistance: false,
  requiredAssistiveDevice: "",
  otherSupportRequirements: "",
  documentName: "",
  documentBase64: "",
  childFullName: "",
  childAge: undefined,
  childGender: undefined,
  autismCenterAttended: "",
  caregiverSupportType: undefined,
  isAssociationMember: false,
  associationName: "",
  hasHealthInsurance: false,
  cbhiIdNumber: "",
  isDirectSupport: false,
  householdRole: "",
  caretakerStatus: "",
  previousSubCity: "",
  previousWoreda: "",
  isDeceased: false,
  deceasedDate: "",
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
  const tOpt = useTranslations("social-affairs.elderlyAndDisabled.options");
  const locale = useLocale() === "en" ? "en" : "am";
  const [faydaStatus, setFaydaStatus] = useState<"none" | "valid" | "invalid">(
    "none",
  );

  const schema =
    type === "DISABLED" ? registerDisabledFormSchema : registerElderlyFormSchema;
  type FormValues =
    | RegisterElderlyFormValues
    | RegisterDisabledFormValues;

  const { userSubCity, userWoreda } = useJurisdictionScope();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      ...DEFAULT_VALUES,
      subCity: userSubCity || "",
      woreda: userWoreda || "",
    },
  });

  useEffect(() => {
    if (userSubCity && !form.getValues("subCity")) {
      form.setValue("subCity", userSubCity);
    }
    if (userWoreda && !form.getValues("woreda")) {
      form.setValue("woreda", userWoreda);
    }
  }, [userSubCity, userWoreda, form]);

  const registerElderly = useRegisterElderly();
  const registerDisabled = useRegisterDisabled();
  const faydaVerify = useFaydaVerify();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [includeVocational, setIncludeVocational] = useState(false);
  const [includePrograms, setIncludePrograms] = useState(false);

  const faydaValue = form.watch("faydaId");
  const dobValue = form.watch("dateOfBirth");
  const prevDobRef = React.useRef<string | undefined>(dobValue);

  useEffect(() => {
    if (dobValue) {
      const derived = calculateAge(dobValue);
      if (derived !== null) {
        form.setValue("age", derived as any, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } else if (prevDobRef.current && !dobValue) {
      form.setValue("age", undefined as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    prevDobRef.current = dobValue;
  }, [dobValue, form]);

  const isAutismCaregiver = type === "DISABLED" && form.watch("disabilityType") === "AUTISM_CAREGIVER";
  const workSectorOptions = getWorkSectorOptions(type);

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
          form.setValue("fullName", result.fullName, { shouldValidate: true, shouldDirty: true });
          const { firstName, lastName, grandfatherName } = parseFullName(result.fullName);
          form.setValue("firstName", firstName);
          form.setValue("lastName", lastName);
          form.setValue("grandfatherName", grandfatherName);
        }
        if (result.dateOfBirth) {
          const formattedDob = result.dateOfBirth.replace(/\//g, "-").split("T")[0];
          form.setValue("dateOfBirth", formattedDob, {
            shouldValidate: true,
            shouldDirty: true,
          });
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

  const [serverError, setServerError] = useState<string | null>(null);
  const [duplicateBeneficiary, setDuplicateBeneficiary] = useState<{
    clientId?: number;
    profileId?: number;
    fullName?: string;
    faydaId?: string;
    cityIdNumber?: string;
    subCity?: string;
    woreda?: string;
    category?: string;
  } | null>(null);
  const [conflictClient, setConflictClient] =
    useState<CrossModuleClientData | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const cleanString = (val?: string) => {
    if (!val) return undefined;
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const cleanNumber = (val?: any) => {
    if (val === undefined || val === null || val === "") return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  };

  const buildPayload = (values: FormValues, confirmLink = false) => {
    const v = values as any;
    const parsedName = parseFullName(v.fullName);
    const resolvedFirstName = v.firstName?.trim() || parsedName.firstName;
    const resolvedLastName = v.lastName?.trim() || parsedName.lastName;
    const resolvedGrandfather = cleanString(v.grandfatherName) || cleanString(parsedName.grandfatherName);

    return {
      ...values,
      faydaId: v.faydaId?.trim(),
      firstName: resolvedFirstName,
      lastName: resolvedLastName,
      grandfatherName: resolvedGrandfather,
      phoneNumber: cleanString(v.phoneNumber),
      dateOfBirth: cleanString(v.dateOfBirth),
      age: cleanNumber(v.age),
      familyMembersCount: cleanNumber(v.familyMembersCount),
      monthlyIncome: cleanNumber(v.monthlyIncome),
      subCity: cleanString(v.subCity) || userSubCity || undefined,
      woreda: cleanString(v.woreda) || userWoreda || undefined,
      zone: cleanString(v.zone),
      block: cleanString(v.block),
      houseNumber: cleanString(v.houseNumber),
      cause: cleanString(v.cause),
      previousProfession: cleanString(v.previousProfession),
      previousSupport: cleanString(v.previousSupport),
      requiredSupportType: cleanString(v.requiredSupportType),
      requiredAssistiveDevice: cleanString(v.requiredAssistiveDevice),
      otherSupportRequirements: (() => {
        const raw = cleanString(v.otherSupportRequirements);
        if (v.disabilityType === "AUTISM_CAREGIVER") {
          const parts: string[] = [];
          if (v.childFullName) parts.push(`Child: ${v.childFullName.trim()}`);
          if (v.childAge) parts.push(`Age: ${v.childAge}`);
          if (v.childGender) parts.push(`Gender: ${v.childGender}`);
          if (v.autismCenterAttended) parts.push(`Center: ${v.autismCenterAttended.trim()}`);
          if (v.caregiverSupportType) parts.push(`Primary Need: ${v.caregiverSupportType.trim()}`);
          if (raw && !raw.startsWith("Child:")) parts.push(`Details: ${raw}`);
          return parts.length > 0 ? parts.join(" | ") : raw;
        }
        return raw;
      })(),
      childFullName: cleanString(v.childFullName),
      childAge: cleanNumber(v.childAge),
      childGender: v.childGender || undefined,
      autismCenterAttended: cleanString(v.autismCenterAttended),
      caregiverSupportType: cleanString(v.caregiverSupportType),
      documentName: cleanString(v.documentName),
      documentBase64: cleanString(v.documentBase64),
      confirmLink,
    };
  };

  const handleMutationError = (error: any, rawPayload: any) => {
    const resp = error?.response?.data;
    if (resp?.error === "CrossModuleConflict" && resp?.existingClient) {
      setConflictClient(resp.existingClient);
      setPendingPayload(rawPayload);
      setConflictOpen(true);
      return;
    }

    if (resp?.existingBeneficiary) {
      setDuplicateBeneficiary(resp.existingBeneficiary);
    } else {
      setDuplicateBeneficiary(null);
    }

    let message = "Registration failed. Please check the entered data.";
    if (resp) {
      if (typeof resp.message === "string") {
        message = resp.message;
      } else if (Array.isArray(resp.message)) {
        message = resp.message.join(", ");
      } else if (
        typeof resp.error === "string" &&
        resp.error !== "Internal Server Error"
      ) {
        message = resp.error;
      }
    } else if (error?.message) {
      message = error.message;
    }

    // Map common error targets to field errors
    const lower = message.toLowerCase();
    if (
      lower.includes("fayda") ||
      lower.includes("already exists") ||
      lower.includes("profile already exists")
    ) {
      form.setError("faydaId" as any, { message });
    }
    if (lower.includes("phone")) {
      form.setError("phoneNumber" as any, { message });
    }

    setServerError(message);
    toast.error(message);
  };

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    setDuplicateBeneficiary(null);
    const payload = buildPayload(values, false) as any;
    const mutation =
      type === "DISABLED" ? registerDisabled : registerElderly;
    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(tSrs("registerSuccess"));
        form.reset({
          ...DEFAULT_VALUES,
          subCity: userSubCity || "",
          woreda: userWoreda || "",
        });
        setSelectedFile(null);
        setFaydaStatus("none");
        setServerError(null);
        setDuplicateBeneficiary(null);
        onSuccess?.();
      },
      onError: (error: any) => {
        handleMutationError(error, payload);
      },
    });
  };

  const handleConfirmLink = () => {
    if (!pendingPayload) return;
    setIsLinking(true);
    setDuplicateBeneficiary(null);
    const linkPayload = {
      ...pendingPayload,
      confirmLink: true,
    };
    const mutation =
      type === "DISABLED" ? registerDisabled : registerElderly;
    mutation.mutate(linkPayload, {
      onSuccess: () => {
        setIsLinking(false);
        setConflictOpen(false);
        setConflictClient(null);
        setPendingPayload(null);
        setServerError(null);
        setDuplicateBeneficiary(null);
        toast.success(tSrs("registerSuccess"));
        form.reset({
          ...DEFAULT_VALUES,
          subCity: userSubCity || "",
          woreda: userWoreda || "",
        });
        setSelectedFile(null);
        setFaydaStatus("none");
        onSuccess?.();
      },
      onError: (error: any) => {
        setIsLinking(false);
        setConflictOpen(false);
        handleMutationError(error, linkPayload);
      },
    });
  };

  const isPending = registerElderly.isPending || registerDisabled.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        {duplicateBeneficiary ? (
          (() => {
            const isDifferentWoreda = Boolean(
              userWoreda &&
                duplicateBeneficiary.woreda &&
                userWoreda.trim().toLowerCase() !==
                  duplicateBeneficiary.woreda.trim().toLowerCase(),
            );
            const locText = [
              duplicateBeneficiary.subCity,
              duplicateBeneficiary.woreda,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <div className="rounded-xs border border-amber-300 bg-amber-50/90 p-3.5 text-xs text-amber-950 shadow-2xs flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-amber-900 uppercase tracking-wide font-mono text-[11px]">
                        Beneficiary Profile Already Exists
                      </p>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-amber-200/80 text-amber-900 border border-amber-300">
                        {duplicateBeneficiary.category ||
                          (type === "DISABLED" ? "DISABILITY" : "ELDERLY")}
                      </span>
                      {locText && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 border border-amber-200">
                          {locText}
                        </span>
                      )}
                    </div>
                    <p className="text-amber-900 leading-relaxed">
                      A beneficiary profile already exists in this module for{" "}
                      <strong className="font-semibold text-amber-950">
                        {duplicateBeneficiary.fullName || "this person"}
                      </strong>{" "}
                      with Fayda ID{" "}
                      <code className="font-mono bg-amber-200/60 px-1 py-0.5 rounded text-[11px] text-amber-950">
                        {duplicateBeneficiary.faydaId}
                      </code>
                      {locText ? ` (registered in ${locText})` : ""}.
                    </p>
                    {isDifferentWoreda ? (
                      <p className="text-[11px] text-amber-800 bg-amber-100/70 p-2 rounded-xs border border-amber-200/60">
                        <strong>Jurisdiction Notice:</strong> This beneficiary is registered in a different woreda ({locText}). Because municipal records are scoped by administrative boundary, officers in other woredas cannot view or alter their case files. If this beneficiary has relocated to your woreda, contact your sub-city administrator.
                      </p>
                    ) : (
                      <p className="text-[11px] text-amber-800">
                        This person is already registered in your jurisdiction. You can directly view their existing profile and manage their services.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!isDifferentWoreda && duplicateBeneficiary.clientId && (
                    <Link
                      href={`/social-affairs/elderly-and-disabled/beneficiaries/${duplicateBeneficiary.clientId}`}
                      onClick={() => onSuccess?.()}
                      className="inline-flex items-center gap-1.5 bg-[#1769AA] hover:bg-[#125380] text-white font-medium px-3 py-1.5 rounded-xs text-xs transition-colors shadow-2xs cursor-pointer font-mono"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Profile
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setDuplicateBeneficiary(null)}
                    className="text-amber-600 hover:text-amber-900 transition-colors p-1 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()
        ) : serverError ? (
          <div className="rounded-xs border border-red-300 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-red-900 uppercase tracking-wide font-mono text-[11px]">
                Registration Failed
              </p>
              <p className="leading-relaxed">{serverError}</p>
            </div>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="text-red-400 hover:text-red-700 transition-colors p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
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
                        placeholder={
                          locale === "am"
                            ? "ምሳሌ፡ 1234567890123456"
                            : "e.g. 1234567890123456"
                        }
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.fullName")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholders.fullName")}
                      {...field}
                      value={
                        field.value ||
                        [
                          form.watch("firstName"),
                          form.watch("lastName"),
                          form.watch("grandfatherName"),
                        ]
                          .filter(Boolean)
                          .join(" ")
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        const { firstName, lastName, grandfatherName } = parseFullName(val);
                        form.setValue("firstName", firstName);
                        form.setValue("lastName", lastName);
                        form.setValue("grandfatherName", grandfatherName);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
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
                          <SelectValue placeholder={tOpt("placeholders.selectGender")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SEX_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {tOpt(`sex.${o.value}` as any)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.dob")}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
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
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{tSrs("age")}</FormLabel>
                      {dobValue && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {locale === "am" ? "ከተወለዱበት ቀን የተሰላ" : "Auto-derived"}
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="65"
                        {...field}
                        value={(field.value as any) ?? ""}
                        readOnly={!!dobValue}
                        className={
                          dobValue
                            ? "bg-slate-50 text-slate-700 cursor-not-allowed"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A] border-b border-[#E3E7EB] pb-1.5">
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
                          <SelectValue placeholder={tOpt("placeholders.selectEmployment")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EMPLOYMENT_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {tOpt(`employment.${o.value}` as any)}
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
                          <SelectValue placeholder={tOpt("placeholders.selectMarital")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MARITAL_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {tOpt(`marital.${o.value}` as any)}
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("placeholders.selectEducation")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {locale === "am" ? opt.labelAm : opt.labelEn}
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
              {isAutismCaregiver
                ? t("sections.caregiverDetails")
                : t("sections.details", { type: t("disabled") })}
            </h3>

            {isAutismCaregiver && (
              <div className="flex items-start gap-3 p-3 rounded-xs border border-blue-200 bg-blue-50/70 text-blue-900 text-xs">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <p>{t("autismCaregiverNotice")}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="disabilityCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.disabilityCategory")} *</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        // Reset sub-type if it doesn't belong to newly selected category
                        const currentSubType = form.getValues("disabilityType");
                        if (currentSubType) {
                          const currentCat = getCategoryForSubType(currentSubType);
                          if (currentCat !== val) {
                            form.setValue("disabilityType", "");
                          }
                        }
                      }}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("placeholders.selectCategory")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DISABILITY_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {tOpt.has(`disabilityCategories.${cat.value}`)
                              ? tOpt(`disabilityCategories.${cat.value}`)
                              : (locale === "en" ? cat.enLabel : cat.amLabel)}
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
                name="disabilityType"
                render={({ field }) => {
                  const selectedCategory =
                    (form.watch("disabilityCategory") as DisabilityCategoryKey) || undefined;
                  const availableSubTypes = selectedCategory
                    ? getSubTypesForCategory(selectedCategory)
                    : [];

                  return (
                    <FormItem>
                      <FormLabel>{t("fields.disabilitySubType")} *</FormLabel>
                      <Select
                        disabled={!selectedCategory || availableSubTypes.length === 0}
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedCategory
                                  ? t("placeholders.selectCategory")
                                  : t("placeholders.selectSubType")
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSubTypes.map((st) => (
                            <SelectItem key={st.value} value={st.value}>
                              {tOpt.has(`disabilityTypes.${st.value}`)
                                ? tOpt(`disabilityTypes.${st.value}`)
                                : (locale === "en" ? st.enLabel : st.amLabel)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="disabilitySeverity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isAutismCaregiver
                        ? t("fields.autismSeverity")
                        : t("fields.disabilityLevel")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tOpt("placeholders.selectSeverity")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SEVERITY_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {tOpt(`severity.${o.value}` as any)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isAutismCaregiver && (
              <div className="space-y-3 p-4 rounded-xs border border-blue-100 bg-blue-50/40">
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">
                  {t("sections.caregiverDetails")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="childFullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.childFullName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.childFullName")}
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
                    name="childAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.childAge")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("placeholders.childAge")}
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
                    name="childGender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.childGender")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={tOpt("placeholders.selectGender")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">{tOpt("sex.MALE")}</SelectItem>
                            <SelectItem value="FEMALE">{tOpt("sex.FEMALE")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="autismCenterAttended"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.autismCenterAttended")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("placeholders.autismCenterAttended")}
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
                    name="caregiverSupportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.caregiverSupportType")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("placeholders.caregiverSupportType")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CAREGIVER_SUPPORT_OPTIONS.map((cst) => (
                              <SelectItem key={cst} value={cst}>
                                {tOpt(`caregiverSupportTypes.${cst}` as any)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="cause"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isAutismCaregiver ? t("fields.autismCause") : t("fields.cause")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        isAutismCaregiver
                          ? t("placeholders.autismDiagnosisHistory")
                          : t("placeholders.cause")
                      }
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
                    <FormLabel>
                      {isAutismCaregiver
                        ? t("fields.autismAssistiveDevice")
                        : tSrs("requiredAssistiveDevice")}
                    </FormLabel>
                    <FormControl>
                      <AssistiveDeviceSelect
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        locale={locale}
                        onAutoCheckPhysicalAssistance={() => {
                          if (!form.getValues("requiresPhysicalAssistance")) {
                            form.setValue("requiresPhysicalAssistance", true);
                          }
                        }}
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
                      {isAutismCaregiver
                        ? t("fields.autismPhysicalAssistance")
                        : tSrs("requiresPhysicalAssistance")}
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
                      placeholder={
                        locale === "am"
                          ? "ሌሎች ተጨማሪ የድጋፍ ፍላጎቶች ካሉ ይግለጹ..."
                          : "Any other needs..."
                      }
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
                {locale === "am"
                  ? "ደጋፊ ሰነድ / የሕክምና ማስረጃ (አማራጭ)"
                  : "Supporting Document / Medical Evidence (Optional)"}
              </FormLabel>
              <p className="text-xs text-slate-500">
                {locale === "am"
                  ? "የሕክምና ማስረጃ፣ የአካል ጉዳት ምስክር ወረቀት ወይም ደጋፊ ደብዳቤ ያያይዙ (PDF, PNG, JPG, DOCX - ከፍተኛ 10MB)"
                  : "Attach medical report, disability certificate, or supporting letter (PDF, PNG, JPG, DOCX - max 10MB)"}
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
                    {locale === "am" ? "አስወግድ" : "Remove"}
                  </Button>
                )}
              </div>
              {selectedFile && (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  {locale === "am"
                    ? `✓ ለመስቀል ተዘጋጅቷል፡ ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
                    : `✓ Ready to upload: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
              {type === "ELDERLY" ? tSrs("workProfileTitle") : tSrs("trainingProfileTitle")}
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#1769AA] font-semibold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={includeVocational}
                onChange={(e) => setIncludeVocational(e.target.checked)}
                className="rounded text-[#1769AA] focus:ring-0"
              />
              <span>
                {type === "ELDERLY"
                  ? tSrs("includeWorkSection")
                  : tSrs("includeTrainingSection")}
              </span>
            </label>
          </div>

          {includeVocational && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="preferredTraining1"
              render={({ field }) => {
                const options = field.value && !workSectorOptions.includes(field.value as any)
                  ? [field.value, ...workSectorOptions]
                  : workSectorOptions;
                return (
                  <FormItem>
                    <FormLabel>
                      {type === "ELDERLY"
                        ? tSrs("elderlyTrainingChoice1")
                        : tSrs("disabledTrainingChoice1")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tOpt("placeholders.firstChoice")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.map((o) => (
                          <SelectItem key={o} value={o}>
                            {tOpt(`training.${o}` as any) || getWorkSectorDisplayLabel(o, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="preferredTraining2"
              render={({ field }) => {
                const options = field.value && !workSectorOptions.includes(field.value as any)
                  ? [field.value, ...workSectorOptions]
                  : workSectorOptions;
                return (
                  <FormItem>
                    <FormLabel>
                      {type === "ELDERLY"
                        ? tSrs("elderlyTrainingChoice2")
                        : tSrs("disabledTrainingChoice2")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tOpt("placeholders.secondChoice")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.map((o) => (
                          <SelectItem key={o} value={o}>
                            {tOpt(`training.${o}` as any) || getWorkSectorDisplayLabel(o, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="preferredTraining3"
              render={({ field }) => {
                const options = field.value && !workSectorOptions.includes(field.value as any)
                  ? [field.value, ...workSectorOptions]
                  : workSectorOptions;
                return (
                  <FormItem>
                    <FormLabel>
                      {type === "ELDERLY"
                        ? tSrs("elderlyTrainingChoice3")
                        : tSrs("disabledTrainingChoice3")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tOpt("placeholders.thirdChoice")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.map((o) => (
                          <SelectItem key={o} value={o}>
                            {tOpt(`training.${o}` as any) || getWorkSectorDisplayLabel(o, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
                        <SelectValue placeholder={tOpt("placeholders.selectWorkplace")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WORKPLACE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {tOpt(`workplace.${o.value}` as any)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === "DISABLED" && (
              <FormField
                control={form.control}
                name="previousProfession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSrs("previousProfession")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSrs("disabledProfessionPlaceholder")}
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

          {type === "ELDERLY" && (
            <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sky-950 font-medium text-sm">
                <BookOpen className="h-4 w-4 text-sky-700" />
                <span>{tSrs("elderlyProfessionMentorship")}</span>
              </div>
              <p className="text-xs text-sky-800">
                {tSrs("elderlyProfessionDesc")}
              </p>
              <FormField
                control={form.control}
                name="previousProfession"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={2}
                        className="bg-white border-sky-200 placeholder:text-slate-400"
                        placeholder={tSrs("elderlyProfessionPlaceholder")}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <FormField
            control={form.control}
            name="previousSupport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSrs("previousSupport")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      locale === "am"
                        ? "ቀደም ሲል የተሰጠ የድጋፍ ዓይነት ካለ እዚህ ይግለጹ..."
                        : "Describe any support previously provided..."
                    }
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
          {type === "ELDERLY" ? (
            <FormField
              control={form.control}
              name="requiredSupportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("workSupportType")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        locale === "am"
                          ? "ምሳሌ፡ የመስሪያ ቦታ፣ መነሻ ካፒታል፣ ቁሳቁስ..."
                          : "e.g. Workspace, Seed capital, Equipment..."
                      }
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="otherSupportRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSrs("disabledPostTrainingSupport")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        locale === "am"
                          ? "ምሳሌ፡ የስራ ማስጀመሪያ እቃዎች፣ አጋዥ ቴክኖሎጂ፣ የስራ ቅጥር ድጋፍ..."
                          : "e.g. Startup tools, Assistive devices, Job linkage..."
                      }
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
          )}
        </div>

        {type === "ELDERLY" && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
                {locale === "am"
                  ? "የማህበራዊ ጥበቃ እና መርሃ-ግብሮች (Social Protection & Programs)"
                  : "Social Protection & Cohort Extensions"}
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[#1769AA] font-semibold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={includePrograms}
                  onChange={(e) => setIncludePrograms(e.target.checked)}
                  className="rounded text-[#1769AA] focus:ring-0"
                />
                <span>
                  {locale === "am"
                    ? "የመርሃ-ግብሮች እና ማህበረሰብ መረጃ አካትት"
                    : "Include Program Details"}
                </span>
              </label>
            </div>

            {includePrograms && (
              <div className="space-y-4 pt-1 animate-in fade-in duration-200 bg-slate-50/50 p-4 rounded-xs border border-slate-200">
                {/* 1. Target Programs */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-700 block uppercase">
                    {locale === "am" ? "የተጠቃሚነት እና የአባልነት መርሃ-ግብሮች" : "Program Memberships & Benefits"}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Association (mahber) */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xs space-y-2">
                      <FormField
                        control={form.control}
                        name="isAssociationMember"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 text-xs font-semibold">
                              {locale === "am" ? "የማህበር አባል (mahber)" : "Association Member"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {form.watch("isAssociationMember") && (
                        <FormField
                          control={form.control}
                          name="associationName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={locale === "am" ? "የማህበሩ ስም (ምሳሌ፡ የወረዳ 07 ማህበር)" : "Association Name"}
                                  className="h-7 text-xs font-mono"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Direct Support (ቀ.ድ) */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xs space-y-2">
                      <FormField
                        control={form.control}
                        name="isDirectSupport"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 text-xs font-semibold">
                              {locale === "am" ? "የቀጥታ ድጋፍ ተጠቃሚ (ቀ.ድ)" : "Direct Support (PSNP)"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <span className="text-[11px] text-slate-400 font-mono block">
                        {locale === "am" ? "የሴፍቲኔት ቀጥተኛ የጥሬ ገንዘብ ድጋፍ" : "Productive safety net direct cash support"}
                      </span>
                    </div>

                    {/* Health Insurance */}
                    <div className="p-3 bg-white border border-slate-200 rounded-xs space-y-2">
                      <FormField
                        control={form.control}
                        name="hasHealthInsurance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 text-xs font-semibold">
                              {locale === "am" ? "የጤና መድህን (CBHI)" : "Health Insurance"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {form.watch("hasHealthInsurance") && (
                        <FormField
                          control={form.control}
                          name="cbhiIdNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={locale === "am" ? "የመድህን መታወቂያ ቁጥር" : "CBHI Card Number"}
                                  className="h-7 text-xs font-mono"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Community & Household Status */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-mono font-bold text-slate-700 block uppercase">
                    {locale === "am" ? "የማህበረሰብ እና የቤተሰብ ሁኔታ" : "Community & Household Demographics"}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="householdRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            {locale === "am" ? "የቤተሰብ ሀላፊነት" : "Household Role"}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? ""}>
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs font-mono bg-white">
                                <SelectValue placeholder={locale === "am" ? "ሀላፊነት ይምረጡ..." : "Select role..."} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="አባወራ">{locale === "am" ? "አባወራ (Male Head)" : "Male Head of Household"}</SelectItem>
                              <SelectItem value="እማወራ">{locale === "am" ? "እማወራ (Female Head)" : "Female Head of Household"}</SelectItem>
                              <SelectItem value="ጥገኛ">{locale === "am" ? "ጥገኛ (Dependent)" : "Dependent"}</SelectItem>
                              <SelectItem value="ብቸኛ">{locale === "am" ? "ብቸኛ (Living Alone)" : "Living Alone"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="caretakerStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            {locale === "am" ? "የረዳት ሁኔታ" : "Caretaker Status"}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? ""}>
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs font-mono bg-white">
                                <SelectValue placeholder={locale === "am" ? "የረዳት ሁኔታ ይምረጡ..." : "Select caretaker status..."} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ያለው">{locale === "am" ? "ያለው (Has Caretaker)" : "Has Caretaker"}</SelectItem>
                              <SelectItem value="የሌለው">{locale === "am" ? "የሌለው (No Caretaker)" : "No Caretaker"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 3. Relocation & Vital Status */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-mono font-bold text-slate-700 block uppercase">
                    {locale === "am" ? "የዝውውር እና የህልውና ሁኔታ" : "Relocation & Vital Status"}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-xs space-y-2">
                      <span className="text-xs font-semibold text-slate-700 block">
                        {locale === "am" ? "ከሌላ ክፍለ ከተማ/ወረዳ የተዛወሩ (Relocated)" : "Relocated from other Sub-City"}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="previousSubCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={locale === "am" ? "የቀድሞ ክ/ከተማ (ምሳሌ፡ ቂርቆስ)" : "Prev. Sub-City"}
                                  className="h-7 text-xs font-mono"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="previousWoreda"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={locale === "am" ? "የቀድሞ ወረዳ (ምሳሌ፡ ወረዳ 07)" : "Prev. Woreda"}
                                  className="h-7 text-xs font-mono"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xs space-y-2">
                      <FormField
                        control={form.control}
                        name="isDeceased"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0 text-xs font-semibold text-rose-700">
                              {locale === "am" ? "በሞት የተለዩ (Deceased Archive)" : "Deceased (Archive)"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {form.watch("isDeceased") && (
                        <FormField
                          control={form.control}
                          name="deceasedDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="date"
                                  className="h-7 text-xs font-mono"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 cursor-pointer"
            onClick={() => onSuccess?.()}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isPending || isLinking}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs cursor-pointer"
          >
            {(isPending || isLinking) && (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            )}
            {isLinking
              ? "Linking..."
              : isPending
                ? "Registering..."
                : (submitLabel ?? t("registerNew"))}
          </Button>
        </div>
      </form>

      <CrossModuleConflictDialog
        open={conflictOpen}
        onOpenChange={setConflictOpen}
        client={conflictClient}
        targetModuleName={
          type === "DISABLED" ? "Disability Affairs" : "Elderly Affairs"
        }
        onConfirmLink={handleConfirmLink}
        isLinking={isLinking}
      />
    </Form>
  );
}
