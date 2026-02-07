"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Heart, CheckCircle, FileText, Eye } from "lucide-react";
import { useApplicationFormStore } from "@/stores/application-form-store";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { formatAge } from "@/lib/utils";
import { useSubmitApplicationMutation } from "@/hooks/applicants-portal";
import { useTranslations } from "next-intl";

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

  // cleanup object URLs on unmount — ensure this hook is declared before any early returns
  useEffect(() => {
    return () => {
      objectUrls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          // ignore
        }
      });
    };
  }, [objectUrls]);

  const handleBack = () => {
    router.push("/applicant-portal/application/new/step3");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    if (!token) {
      const msg = t("review.signInRequired");
      setError(msg);
      toast.error(msg);
      setSubmitting(false);
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("cityIdNumber", step1?.cityIdNumber ?? "");
    formData.append("dateOfBirth", step1?.dateOfBirth ?? "");
    formData.append("address", step1?.address ?? "");
    formData.append("educationLevel", step1?.educationLevel ?? "");
    formData.append("occupation", step1?.occupation ?? "");
    formData.append("monthlyIncome", String(step1?.monthlyIncome ?? "0"));
    formData.append("spouseCityIdNumber", step1?.spouseCityIdNumber ?? "");
    formData.append("spouseAgreement", "true");

    formData.append(
      "preferredChildren[ageRange][min]",
      String(step1?.preferredChildren?.ageRange?.min ?? 0),
    );
    formData.append(
      "preferredChildren[ageRange][max]",
      String(step1?.preferredChildren?.ageRange?.max ?? 0),
    );
    formData.append(
      "preferredChildren[sex]",
      String(step1?.preferredChildren?.sex ?? "ANY"),
    );
    formData.append(
      "preferredChildren[number]",
      String(step1?.preferredChildren?.number ?? 0),
    );

    // Helper for files
    const appendIfFile = (fieldName: string, file?: File | null) => {
      if (file && file instanceof File) {
        formData.append(fieldName, file, file.name);
      }
    };

    appendIfFile("housePlan", (step2 as any)?.housePlan ?? null);
    appendIfFile("marriageCertificate", step2?.marriageCertificate ?? null);
    appendIfFile("businessLicense", (step2 as any)?.businessLicense ?? null);
    appendIfFile("idDocument", step1?.id ?? null);
    appendIfFile("incomeDocument", step1?.income ?? null);
    appendIfFile("maritalStatusDocument", step3?.maritalStatus ?? null);
    appendIfFile("photo", step3?.photo ?? null);
    appendIfFile(
      "psychologicalWellbeing",
      step3?.psychologicalWellbeing ?? null,
    );
    appendIfFile("criminalClearance", step2?.criminalClearance ?? null);
    appendIfFile("medicalDocument", step2?.medical ?? null);
    appendIfFile("birthCertificate", step1?.birthCertificate ?? null);

    mutate(formData, {
      onSuccess: () => {
        toast.success(t("review.submissionSuccess"));
        reset();
        router.push("/applicant-portal/portal");
      },
      onError: (error: any) => {
        toast.error(error.message ?? "Submission failed");
      },
    });
  };

  if (!step1 || !step2 || !step3) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t("review.loadingData")}</p>
      </div>
    );
  }

  const formatFileSize = (size?: number) => {
    if (!size) return "";
    const kb = size / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const filePlaceholder = (file: File | null | undefined, label?: string) => {
    if (!file) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between"></div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {label ?? t("applicationDetails.noFile")}
                </p>
                <p className="text-xs text-gray-500">
                  {t("applicationDetails.noFileUploaded")}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {/* View button will open file in new tab */}
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg min-w-0 flex-1 max-w-xs">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {file.type} • {formatFileSize(file.size)}
              </p>
            </div>
            <div className="ml-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:cursor-pointer border-blue-200 rounded-lg text-blue-500 hover:text-blue-600"
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
                <Eye className="text-sm" /> {t("applicationDetails.view")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("review.title")}
        </h2>
        <p className="text-gray-600">{t("review.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1 Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("review.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.id")}
                </span>

                {filePlaceholder(step1?.id, t("applicationDetails.fields.id"))}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.birthCertificate")}:
                </span>
                {filePlaceholder(
                  step1?.birthCertificate,
                  t("applicationDetails.fields.birthCertificate"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.incomeDocument")}:
                </span>
                {filePlaceholder(
                  step1?.income,
                  t("applicationDetails.fields.incomeDocument"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.medical")}:
                </span>
                {filePlaceholder(
                  step2?.medical,
                  t("applicationDetails.fields.medical"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.criminalDocument")}:
                </span>
                {filePlaceholder(
                  step2?.criminalClearance,
                  t("applicationDetails.fields.criminalDocument"),
                )}
              </div>
            </div>

            {/* Textual personal info */}
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {t("review.details")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.cityIdNumber")}
                  </span>
                  <p className="text-gray-900">{step1?.cityIdNumber ?? "-"}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.dateOfBirth")}
                  </span>
                  <p className="text-gray-900">{step1?.dateOfBirth ?? "-"}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.address")}
                  </span>
                  <p className="text-gray-900">{step1?.address ?? "-"}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.educationLevel")}
                  </span>
                  <p className="text-gray-900">
                    {step1?.educationLevel ?? "-"}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.occupation")}
                  </span>
                  <p className="text-gray-900">{step1?.occupation ?? "-"}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.monthlyIncome")}
                  </span>
                  <p className="text-gray-900">
                    {typeof step1?.monthlyIncome === "number"
                      ? step1?.monthlyIncome
                      : (step1?.monthlyIncome ?? "-")}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.spouseCityIdNumber")}
                  </span>
                  <p className="text-gray-900">
                    {step1?.spouseCityIdNumber ?? "-"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <span className="font-medium text-gray-500">
                    {t("applicationDetails.fields.preferredChildren")}
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.ageMin")}
                      </p>
                      <p className="text-gray-900">
                        {formatAge(step1?.preferredChildren?.ageRange?.min) ??
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.ageMax")}
                      </p>
                      <p className="text-gray-900">
                        {formatAge(step1?.preferredChildren?.ageRange?.max) ??
                          "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.number")}
                      </p>
                      <p className="text-gray-900">
                        {step1?.preferredChildren?.number ?? "-"}
                      </p>
                    </div>
                    <div className="md:col-span-3 mt-1">
                      <p className="text-xs text-gray-500">
                        {t("applicationDetails.fields.preferredSex")}
                      </p>
                      <p className="text-gray-900">
                        {step1?.preferredChildren?.sex ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 Review */}
        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("review.additionalDocs")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.marriageCertificate")}
                </span>

                {filePlaceholder(
                  (step2 as any)?.marriageCertificate ?? null,
                  t("applicationDetails.fields.marriageCertificate"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.maritalStatus")}:
                </span>
                {filePlaceholder(
                  step3?.maritalStatus ?? null,
                  t("applicationDetails.fields.maritalStatus"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.wellBeing")}:
                </span>
                {filePlaceholder(
                  step3?.psychologicalWellbeing,
                  t("applicationDetails.fields.wellBeing"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.photo")}:
                </span>
                {filePlaceholder(
                  step3?.photo,
                  t("applicationDetails.fields.photo"),
                )}
              </div>
              <div>
                <span className="font-medium text-gray-500">
                  {t("applicationDetails.fields.criminalDocument")}:
                </span>
                {filePlaceholder(
                  step2?.criminalClearance,
                  t("applicationDetails.fields.criminalDocument"),
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 Review */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Data from ID number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">First Name</h4>
                <div>
                  <span className="font-medium text-gray-500">Last Name</span>
                  <p></p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Gender:</span>
                  <p>male</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Age</span>
                  <p>22</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Adress</h4>
                <div>
                  <span className="font-medium text-gray-500">City</span>
                  <p></p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">sub city</span>
                  <p></p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">woreda</span>
                  <p></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">
              {t("review.readyToSubmit")}
            </h3>
            <p className="text-sm text-blue-800 mt-1">
              {t("review.confirmationText")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {t("review.previousStep")}
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-8 bg-green-600 hover:bg-green-700"
          disabled={isPending || success}
        >
          {isPending
            ? t("review.submitting")
            : success
              ? t("review.submitted")
              : t("review.submitApplication")}
        </Button>
      </div>
    </div>
  );
}
