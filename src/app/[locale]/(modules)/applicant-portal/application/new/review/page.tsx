"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Heart,
  CheckCircle,
  FileText,
  Eye,
  AlertTriangle,
  Loader2,
  Upload,
} from "lucide-react";
import { useApplicationFormStore } from "@/stores/application-form-store";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { formatAge } from "@/lib/utils";
import { useSubmitApplicationMutation } from "@/hooks/applicants-portal";
import { useTranslations } from "next-intl";
import { calculateApplicantAge } from "@/schemas/application/applicationStepsSchema";

const isRealFile = (f: any): f is File => {
  return typeof window !== "undefined" && f instanceof File && f.size > 0;
};

export default function ReviewPage() {
  const router = useRouter();
  const { step1, step2, step3, reset } = useApplicationFormStore();
  const { token } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const { mutate, isPending } = useSubmitApplicationMutation();
  const t = useTranslations("applicants-portal");

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
    };
  }, [objectUrls]);

  const handleBack = () => {
    router.push("/applicant-portal/application/new/step3");
  };

  const requiredDocs = [
    {
      label: t("applicationDetails.fields.id") || "ID Document",
      file: step1?.id,
      step: 1,
      stepPath: "/applicant-portal/application/new/step1",
    },
    {
      label:
        t("applicationDetails.fields.birthCertificate") ||
        "Birth Certificate",
      file: step1?.birthCertificate,
      step: 1,
      stepPath: "/applicant-portal/application/new/step1",
    },
    {
      label:
        t("applicationDetails.fields.incomeDocument") || "Income Document",
      file: step1?.income,
      step: 1,
      stepPath: "/applicant-portal/application/new/step1",
    },
    {
      label: t("applicationDetails.fields.medical") || "Medical Document",
      file: step2?.medical,
      step: 2,
      stepPath: "/applicant-portal/application/new/step2",
    },
    {
      label:
        t("applicationDetails.fields.criminalDocument") ||
        "Criminal Clearance",
      file: step2?.criminalClearance,
      step: 2,
      stepPath: "/applicant-portal/application/new/step2",
    },
    {
      label: t("applicationDetails.fields.photo") || "Applicant Photo",
      file: step3?.photo,
      step: 3,
      stepPath: "/applicant-portal/application/new/step3",
    },
    {
      label:
        t("applicationDetails.fields.wellBeing") ||
        "Psychological Wellbeing",
      file: step3?.psychologicalWellbeing,
      step: 3,
      stepPath: "/applicant-portal/application/new/step3",
    },
  ];

  const missingDocs = requiredDocs.filter((d) => !isRealFile(d.file));

  const missingFields: { label: string; step: number; path: string }[] = [];
  if (!step1?.cityIdNumber?.trim()) {
    missingFields.push({
      label: "City ID Number",
      step: 1,
      path: "/applicant-portal/application/new/step1",
    });
  }
  if (!step1?.dateOfBirth?.trim()) {
    missingFields.push({
      label: "Date of Birth",
      step: 1,
      path: "/applicant-portal/application/new/step1",
    });
  }
  if (!step1?.address?.trim()) {
    missingFields.push({
      label: "Address",
      step: 1,
      path: "/applicant-portal/application/new/step1",
    });
  }
  if (!step1?.educationLevel?.trim()) {
    missingFields.push({
      label: "Education Level",
      step: 1,
      path: "/applicant-portal/application/new/step1",
    });
  }
  if (!step1?.occupation?.trim()) {
    missingFields.push({
      label: "Occupation",
      step: 1,
      path: "/applicant-portal/application/new/step1",
    });
  }

  const applicantAge = step1?.dateOfBirth
    ? calculateApplicantAge(step1.dateOfBirth)
    : null;
  const isAgeEligible =
    applicantAge !== null && applicantAge >= 21 && applicantAge <= 60;

  const handleSubmit = async () => {
    setError(null);

    if (!token) {
      const msg =
        t("review.signInRequired") ||
        "Please sign in to submit your application";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (missingDocs.length > 0) {
      const msg = `Please upload all required documents before submitting: ${missingDocs.map((d) => d.label).join(", ")}`;
      setError(msg);
      toast.error(msg, { duration: 6000 });
      return;
    }

    if (missingFields.length > 0) {
      const msg = `Please complete the required details in Step 1: ${missingFields.map((f) => f.label).join(", ")}`;
      setError(msg);
      toast.error(msg, { duration: 6000 });
      return;
    }

    // Check applicant age
    if (!isAgeEligible) {
      const msg = t("review.ageEligibilityError");
      setError(msg);
      toast.error(msg, { duration: 6000 });
      return;
    }

    setSubmitting(true);

    // Build FormData
    const formData = new FormData();
    formData.append("cityIdNumber", step1?.cityIdNumber?.trim() ?? "");
    formData.append("dateOfBirth", step1?.dateOfBirth?.trim() ?? "");
    formData.append("address", step1?.address?.trim() ?? "");
    formData.append("educationLevel", step1?.educationLevel?.trim() ?? "");
    formData.append("occupation", step1?.occupation?.trim() ?? "");
    formData.append("monthlyIncome", String(step1?.monthlyIncome ?? "0"));
    if (step1?.spouseCityIdNumber?.trim()) {
      formData.append("spouseCityIdNumber", step1.spouseCityIdNumber.trim());
    }
    formData.append("spouseAgreement", "true");

    const prefChildren = {
      number: Math.max(1, Number(step1?.preferredChildren?.number) || 1),
      sex: step1?.preferredChildren?.sex || "ANY",
      ageRange: {
        min: Number(step1?.preferredChildren?.ageRange?.min) || 0,
        max: Number(step1?.preferredChildren?.ageRange?.max) || 18,
      },
    };

    formData.append("preferredChildren", JSON.stringify(prefChildren));
    formData.append("preferredChildren[sex]", prefChildren.sex);
    formData.append("preferredChildren[number]", String(prefChildren.number));
    formData.append(
      "preferredChildren[ageRange][min]",
      String(prefChildren.ageRange.min),
    );
    formData.append(
      "preferredChildren[ageRange][max]",
      String(prefChildren.ageRange.max),
    );

    // Helper for files
    const appendIfFile = (fieldName: string, file?: File | null) => {
      if (file && isRealFile(file)) {
        formData.append(fieldName, file, file.name);
      }
    };

    appendIfFile("idDocument", step1?.id);
    appendIfFile("birthCertificate", step1?.birthCertificate);
    appendIfFile("incomeDocument", step1?.income);
    appendIfFile("medicalDocument", step2?.medical);
    appendIfFile("criminalClearance", step2?.criminalClearance);
    appendIfFile("marriageCertificate", step2?.marriageCertificate);
    appendIfFile("photo", step3?.photo);
    appendIfFile("psychologicalWellbeing", step3?.psychologicalWellbeing);
    appendIfFile("maritalStatusDocument", step3?.maritalStatus);

    mutate(formData, {
      onSuccess: () => {
        setSubmitting(false);
        setSuccess(true);
        toast.success(
          t("review.submissionSuccess") ||
            "Adoption application submitted successfully!",
        );
        reset();
        router.push("/applicant-portal/portal");
      },
      onError: (err: any) => {
        setSubmitting(false);
        let friendlyMsg =
          "Submission failed. Please check your information and try again.";

        const data = err?.response?.data;
        if (data) {
          if (typeof data === "string") {
            friendlyMsg = data;
          } else if (data.field && data.message) {
            friendlyMsg = `${data.message}`;
          } else if (data.message && typeof data.message === "string") {
            friendlyMsg = data.message;
            if (data.errors && Array.isArray(data.errors)) {
              const details = data.errors
                .map((e: any) => {
                  if (typeof e === "string") return e;
                  if (e.message) return e.message;
                  if (e.messages && Array.isArray(e.messages))
                    return e.messages.join(", ");
                  return JSON.stringify(e);
                })
                .join("; ");
              friendlyMsg += `: ${details}`;
            }
          } else if (Array.isArray(data.message)) {
            friendlyMsg = data.message.join(", ");
          }
        } else if (err.message) {
          friendlyMsg = err.message;
        }

        setError(friendlyMsg);
        toast.error(friendlyMsg, { duration: 8000 });
      },
    });
  };

  if (!step1 || !step2 || !step3) {
    return (
      <div className="text-center py-12 space-y-4 max-w-md mx-auto">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h3 className="font-semibold text-lg text-gray-900">
          Application Incomplete
        </h3>
        <p className="text-gray-600 text-sm">
          Please fill out the previous steps of the application before reviewing.
        </p>
        <Link href="/applicant-portal/application/new/step1">
          <Button className="mt-2">Start with Step 1</Button>
        </Link>
      </div>
    );
  }

  const formatFileSize = (size?: number) => {
    if (!size) return "";
    const kb = size / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const filePlaceholder = (
    file: File | null | undefined,
    label: string,
    stepPath?: string,
    isOptional?: boolean,
  ) => {
    if (!file || !isRealFile(file)) {
      return (
        <div className="p-3 bg-muted/40 border border-dashed border-border rounded-lg flex items-center justify-between gap-2 min-h-[58px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {label}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isOptional
                  ? "Not provided (optional)"
                  : "Missing / Not attached"}
              </p>
            </div>
          </div>
          {!isOptional && stepPath && (
            <Link href={stepPath}>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2 gap-1 border-amber-300 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                <Upload className="h-3 w-3" />
                Upload
              </Button>
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex items-center justify-between gap-2 min-h-[58px]">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              {formatFileSize(file.size)} • Ready
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-100/50"
          onClick={() => {
            try {
              const url = URL.createObjectURL(file);
              setObjectUrls((s) => [...s, url]);
              window.open(url, "_blank");
            } catch (err) {
              console.error("Unable to preview file", err);
              toast.error(t("review.unableToPreview"));
            }
          }}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          View
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {t("review.title")}
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm">{t("review.subtitle")}</p>
      </div>

      {/* Backend / Submission Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="border-red-300 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200"
        >
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="font-semibold text-red-900 dark:text-red-300">
            Submission Error
          </AlertTitle>
          <AlertDescription className="mt-1 text-sm text-red-800 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Missing Required Documents Warning Alert */}
      {missingDocs.length > 0 && (
        <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="font-semibold text-amber-900 dark:text-amber-300">
            Missing Required Documents ({missingDocs.length})
          </AlertTitle>
          <AlertDescription className="mt-1.5 text-xs text-amber-800 dark:text-amber-300">
            <p>
              Please upload all required documents before submitting your
              application:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {missingDocs.map((doc) => (
                <Link key={doc.label} href={doc.stepPath}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-white dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 hover:bg-amber-100"
                  >
                    Step {doc.step}: Upload {doc.label} →
                  </Button>
                </Link>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Ineligible Age Alert */}
      {!isAgeEligible && applicantAge !== null && (
        <Alert className="border-rose-300 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <AlertTitle className="font-semibold text-rose-900 dark:text-rose-300">
            Adoption Age Requirement Not Met
          </AlertTitle>
          <AlertDescription className="mt-1.5 text-xs text-rose-800 dark:text-rose-300">
            <p>
              Your calculated age based on your date of birth ({step1?.dateOfBirth}) is{" "}
              <strong>{applicantAge} years old</strong>. By regulation, applicants must be between{" "}
              <strong>21 and 60 years old</strong> to apply for adoption.
            </p>
            <div className="mt-2.5">
              <Link href="/applicant-portal/application/new/step1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-white text-rose-900 border-rose-300 hover:bg-rose-100 font-medium"
                >
                  Step 1: Correct Date of Birth →
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1 Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("review.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Personal Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.id")}*
                  </span>
                  {filePlaceholder(
                    step1?.id,
                    t("applicationDetails.fields.id"),
                    "/applicant-portal/application/new/step1",
                  )}
                </div>
                <div>
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.birthCertificate")}*
                  </span>
                  {filePlaceholder(
                    step1?.birthCertificate,
                    t("applicationDetails.fields.birthCertificate"),
                    "/applicant-portal/application/new/step1",
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.incomeDocument")}*
                  </span>
                  {filePlaceholder(
                    step1?.income,
                    t("applicationDetails.fields.incomeDocument"),
                    "/applicant-portal/application/new/step1",
                  )}
                </div>
              </div>
            </div>

            {/* Textual personal info */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("review.details")}
                </h4>
                <Link href="/applicant-portal/application/new/step1">
                  <span className="text-xs text-primary hover:underline">
                    Edit Step 1
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500 text-xs">
                    {t("applicationDetails.fields.cityIdNumber")}
                  </span>
                  <p className="text-gray-900 font-medium">
                    {step1?.cityIdNumber || "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500 text-xs">
                    {t("applicationDetails.fields.dateOfBirth")}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-900 font-medium">
                      {step1?.dateOfBirth || "-"}
                    </p>
                    {applicantAge !== null && !isAgeEligible && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold border bg-rose-50 text-rose-700 border-rose-200">
                        {applicantAge} yrs (Ineligible: 21–60 required)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-500 text-xs">
                    {t("applicationDetails.fields.address")}
                  </span>
                  <p className="text-gray-900 font-medium">
                    {step1?.address || "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500 text-xs">
                    {t("applicationDetails.fields.educationLevel")}
                  </span>
                  <p className="text-gray-900 font-medium">
                    {step1?.educationLevel || "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500 text-xs">
                    {t("applicationDetails.fields.occupation")}
                  </span>
                  <p className="text-gray-900 font-medium">
                    {step1?.occupation || "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500 text-xs">
                    {t("applicationDetails.fields.monthlyIncome")}
                  </span>
                  <p className="text-gray-900 font-medium">
                    {typeof step1?.monthlyIncome === "number"
                      ? `${step1.monthlyIncome.toLocaleString()} ETB`
                      : step1?.monthlyIncome || "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500 text-xs">
                    {t("applicationDetails.fields.spouseCityIdNumber")}
                  </span>
                  <p className="text-gray-900 font-medium">
                    {step1?.spouseCityIdNumber || "Not specified"}
                  </p>
                </div>

                <div className="md:col-span-2 bg-muted/30 p-3 rounded-lg border">
                  <span className="font-medium text-gray-700 text-xs block mb-1">
                    {t("applicationDetails.fields.preferredChildren")}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                    <div>
                      <p className="text-[11px] text-gray-500">
                        {t("applicationDetails.fields.ageMin")}
                      </p>
                      <p className="text-gray-900 font-medium text-xs">
                        {formatAge(step1?.preferredChildren?.ageRange?.min) ??
                          "0 years"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500">
                        {t("applicationDetails.fields.ageMax")}
                      </p>
                      <p className="text-gray-900 font-medium text-xs">
                        {formatAge(step1?.preferredChildren?.ageRange?.max) ??
                          "18 years"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-500">
                        {t("applicationDetails.fields.number")}
                      </p>
                      <p className="text-gray-900 font-medium text-xs">
                        {step1?.preferredChildren?.number ?? 1}
                      </p>
                    </div>
                    <div className="md:col-span-3 mt-1">
                      <p className="text-[11px] text-gray-500">
                        {t("applicationDetails.fields.preferredSex")}
                      </p>
                      <p className="text-gray-900 font-medium text-xs">
                        {step1?.preferredChildren?.sex ?? "ANY"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 & 3 Review: Additional Documents */}
        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("review.additionalDocs")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step 2 Documents
                </h4>
                <Link href="/applicant-portal/application/new/step2">
                  <span className="text-xs text-primary hover:underline">
                    Edit Step 2
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.medical")}*
                  </span>
                  {filePlaceholder(
                    step2?.medical,
                    t("applicationDetails.fields.medical"),
                    "/applicant-portal/application/new/step2",
                  )}
                </div>
                <div>
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.criminalDocument")}*
                  </span>
                  {filePlaceholder(
                    step2?.criminalClearance,
                    t("applicationDetails.fields.criminalDocument"),
                    "/applicant-portal/application/new/step2",
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.marriageCertificate")}{" "}
                    (Optional)
                  </span>
                  {filePlaceholder(
                    step2?.marriageCertificate,
                    t("applicationDetails.fields.marriageCertificate"),
                    "/applicant-portal/application/new/step2",
                    true,
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step 3 Documents
                </h4>
                <Link href="/applicant-portal/application/new/step3">
                  <span className="text-xs text-primary hover:underline">
                    Edit Step 3
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.photo")}*
                  </span>
                  {filePlaceholder(
                    step3?.photo,
                    t("applicationDetails.fields.photo"),
                    "/applicant-portal/application/new/step3",
                  )}
                </div>
                <div>
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.wellBeing")}*
                  </span>
                  {filePlaceholder(
                    step3?.psychologicalWellbeing,
                    t("applicationDetails.fields.wellBeing"),
                    "/applicant-portal/application/new/step3",
                  )}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-medium text-xs text-gray-500 block mb-1">
                    {t("applicationDetails.fields.maritalStatus")}{" "}
                    (Optional)
                  </span>
                  {filePlaceholder(
                    step3?.maritalStatus,
                    t("applicationDetails.fields.maritalStatus"),
                    "/applicant-portal/application/new/step3",
                    true,
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">
              {t("review.readyToSubmit")}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
              {t("review.confirmationText")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleBack}
          disabled={isPending || submitting}
        >
          {t("review.previousStep")}
        </Button>
        <Button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 bg-green-600 hover:bg-green-700 min-w-[180px]"
          disabled={
            isPending ||
            submitting ||
            success ||
            missingDocs.length > 0 ||
            !isAgeEligible
          }
        >
          {isPending || submitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t("review.submitting") || "Submitting..."}</span>
            </div>
          ) : success ? (
            t("review.submitted") || "Submitted"
          ) : (
            t("review.submitApplication") || "Submit Application"
          )}
        </Button>
      </div>
    </div>
  );
}
