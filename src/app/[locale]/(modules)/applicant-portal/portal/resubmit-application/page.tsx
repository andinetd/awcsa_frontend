"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  ApplicationStepOneSchema,
  ApplicationStepOneType,
} from "@/schemas/application/applicationStepsSchema";
import { useFetchedAdoptionApplicationStore } from "@/stores/fetched-adoption-application";
import { useAuthStore } from "@/stores/auth-store";
import { BASE_URL } from "@/lib/base-url";
import { toast } from "sonner";
import {
  Eye,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  FileText,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LanguageSwitcher from "@/components/shared/language-switcher";

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default function ResubmitApplicationPage() {
  const t = useTranslations("applicants-portal");
  const router = useRouter();
  const { application } = useFetchedAdoptionApplicationStore();
  const { token } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const commentsMap = useMemo(() => {
    const map: Record<string, string> = {};
    const comments = application?.fieldComments ?? [];
    if (Array.isArray(comments)) {
      comments.forEach((c: any) => {
        if (c?.field) map[c.field] = c.comment ?? "";
      });
    } else if (comments && typeof comments === "object") {
      Object.entries(comments).forEach(([k, v]) => {
        map[k] = String(v ?? "");
      });
    }
    return map;
  }, [application]);

  const defaultValues: Partial<ApplicationStepOneType> = useMemo(() => {
    const form = application?.formData ?? {};
    return {
      cityIdNumber: form.cityIdNumber ?? "",
      dateOfBirth: form.dateOfBirth ?? "",
      monthlyIncome:
        typeof form.monthlyIncome === "number" ? form.monthlyIncome : undefined,
      address: form.address ?? "",
      educationLevel: form.educationLevel ?? "",
      occupation: form.occupation ?? "",
      spouseCityIdNumber: form.spouseCityIdNumber ?? "",
      preferredChildren: form.preferredChildren ?? undefined,
    } as any;
  }, [application]);

  const form = useForm<ApplicationStepOneType>({
    resolver: zodResolver(ApplicationStepOneSchema),
    defaultValues: defaultValues as ApplicationStepOneType,
  });

  // map of backend field keys -> form field name and rendering kind
  const FIELD_MAP: Record<
    string,
    {
      kind: "text" | "number" | "date" | "file" | "select";
      formName: string;
      label?: string;
    }
  > = {
    // step1
    firstName: {
      kind: "text",
      formName: "firstName",
      label: t("stepone.form.firstName"),
    },
    middleName: {
      kind: "text",
      formName: "middleName",
      label: t("stepone.form.middleName"),
    },
    lastName: {
      kind: "text",
      formName: "lastName",
      label: t("stepone.form.lastName"),
    },
    phoneNumber: {
      kind: "text",
      formName: "phoneNumber",
      label: t("stepone.form.phoneNumber"),
    },
    email: {
      kind: "text",
      formName: "email",
      label: t("stepone.form.email"),
    },
    cityIdNumber: {
      kind: "text",
      formName: "cityIdNumber",
      label: t("stepone.form.cityId"),
    },
    applicantCityIdNumber: {
      kind: "text",
      formName: "cityIdNumber",
      label: t("stepone.form.cityId"),
    },
    dateOfBirth: {
      kind: "date",
      formName: "dateOfBirth",
      label: t("stepone.form.dateOfBirth"),
    },
    monthlyIncome: {
      kind: "number",
      formName: "monthlyIncome",
      label: t("stepone.form.MonthlyIncome"),
    },
    address: {
      kind: "text",
      formName: "address",
      label: t("stepone.form.Address"),
    },
    educationLevel: {
      kind: "select",
      formName: "educationLevel",
      label: t("stepone.form.EducationLevel"),
    },
    occupation: {
      kind: "text",
      formName: "occupation",
      label: t("stepone.form.occupation"),
    },
    spouseCityIdNumber: {
      kind: "text",
      formName: "spouseCityIdNumber",
      label: t("stepone.form.spouseCityIdNumber"),
    },

    // step1 files
    idDocument: { kind: "file", formName: "id", label: t("stepone.form.id") },
    id: { kind: "file", formName: "id", label: t("stepone.form.id") },
    birthCertificate: {
      kind: "file",
      formName: "birthCertificate",
      label: t("stepone.form.birthCertificate"),
    },
    incomeDocument: {
      kind: "file",
      formName: "income",
      label: t("stepone.form.income"),
    },
    income: {
      kind: "file",
      formName: "income",
      label: t("stepone.form.income"),
    },

    // step2 files
    housePlan: {
      kind: "file",
      formName: "housePlan",
      label: t("steptwo.form.housePlan"),
    },
    marriageCertificate: {
      kind: "file",
      formName: "marriageCertificate",
      label: t("steptwo.form.marriageCertificate"),
    },
    businessLicense: {
      kind: "file",
      formName: "businessLicense",
      label: t("steptwo.form.businessLicense"),
    },
    medicalDocument: {
      kind: "file",
      formName: "medical",
      label: t("steptwo.form.medical"),
    },
    criminalClearance: {
      kind: "file",
      formName: "criminal",
      label: t("steptwo.form.criminal"),
    },

    // step3 files
    maritalStatusDocument: {
      kind: "file",
      formName: "maritalStatusDocument",
      label: t("stepthree.form.marital"),
    },
    psychologicalWellbeing: {
      kind: "file",
      formName: "psychologicalWellbeing",
      label: t("stepthree.form.wellBeing"),
    },
    photo: {
      kind: "file",
      formName: "photo",
      label: t("stepthree.form.photo"),
    },
  };

  const commentKeys = Object.keys(commentsMap || {});
  // only render commented fields, keep stable order preferring FIELD_MAP order
  const fieldsToRender = useMemo(() => {
    const ordered: string[] = [];
    Object.keys(FIELD_MAP).forEach((k) => {
      if (commentKeys.includes(k)) ordered.push(k);
    });
    commentKeys.forEach((k) => {
      if (!ordered.includes(k)) ordered.push(k);
    });
    return ordered;
  }, [commentsMap]);

  // split into left (text-like) and right (file-like)
  const textFields = fieldsToRender.filter(
    (k) => (FIELD_MAP[k]?.kind ?? "text") !== "file",
  );
  const fileFields = fieldsToRender.filter(
    (k) => (FIELD_MAP[k]?.kind ?? "text") === "file",
  );

  const viewRemoteFile = async (publicId: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/adoption/files/${publicId}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e: any) {
      console.error("Unable to preview file", e);
      toast.error(t("review.unableToPreview"));
    }
  };

  async function onSubmit(values: ApplicationStepOneType) {
    if (!application) return;
    setSubmitting(true);
    try {
      // Build FormData only from the dynamically-computed fieldsToRender.
      const fd = new FormData();

      // helper: if backendKey is a bracketed path like preferredChildren[ageRange][min]
      // attempt to resolve it from the form values
      const resolveBracketPath = (obj: any, path: string) => {
        if (!path.includes("[")) return undefined;
        const parts = path
          .split(/\[|\]/)
          .map((p) => p.trim())
          .filter(Boolean);
        let cur = obj as any;
        for (const part of parts) {
          if (cur == null) return undefined;
          cur = cur[part];
        }
        return cur;
      };

      const appendIfFile = (fdName: string, file?: File | null) => {
        if (file && file instanceof File) fd.append(fdName, file, file.name);
      };

      const valuesObj = (form.getValues() as any) ?? {};

      for (const backendKey of fieldsToRender) {
        const conf =
          FIELD_MAP[backendKey] ??
          ({ formName: backendKey, kind: "text" } as any);
        const formName = conf.formName ?? backendKey;

        // try direct lookup first
        let val = valuesObj[formName];

        // if not found and backendKey is a bracketed path, resolve it
        if (val === undefined) {
          const nested = resolveBracketPath(valuesObj, backendKey);
          if (nested !== undefined) val = nested;
        }

        // if still undefined, skip this field
        if (val === undefined || val === null) continue;

        if (conf.kind === "file") {
          // file fields expect a File object (or maybe an array with first File)
          if (val instanceof File) {
            appendIfFile(backendKey, val);
          } else if (Array.isArray(val) && val[0] instanceof File) {
            appendIfFile(backendKey, val[0]);
          }
        } else {
          // primitive or object: convert to string
          if (typeof val === "object") {
            try {
              fd.append(backendKey, JSON.stringify(val));
            } catch {
              // fallback
              fd.append(backendKey, String(val));
            }
          } else {
            fd.append(backendKey, String(val));
          }
        }
      }

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // NOTE: endpoint can be adjusted if your backend expects a different route for resubmission
      const url = `${BASE_URL}/public/adoption/applications/${application.id}/resubmit`;

      // use PATCH for resubmission updates
      const res = await fetch(url, { method: "PATCH", headers, body: fd });
      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          const json = JSON.parse(text);
          msg = json.message ?? JSON.stringify(json);
        } catch {}
        toast.error(msg || "Resubmission failed");
        setSubmitting(false);
        return;
      }

      toast.success(t("resubmit.success"));
      router.push("/applicant-portal/portal");
    } catch (e: any) {
      console.error("Resubmit error", e);
      toast.error(e?.message ?? "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!application) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t("form.noApplication")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-slate-100 transition-colors hover:cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {t("resubmit.title")}
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                {t("resubmit.subtitle")}
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
        <div className="h-1 w-20 bg-blue-600 rounded-full ml-14"></div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: text fields card */}
            <Card className="flex-1 shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {t("resubmit.detailsToUpdate")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {textFields.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500 italic">
                        {t("resubmit.noTextFields")}
                      </p>
                    </div>
                  ) : (
                    textFields.map((key) => {
                      const conf = FIELD_MAP[key] ?? {
                        kind: "text",
                        formName: key,
                      };
                      const comment = commentsMap[key];
                      return (
                        <div key={key}>
                          {conf.kind === "select" ? (
                            <FormField
                              control={form.control as any}
                              name={conf.formName as any}
                              render={({ field }: any) => (
                                <FormItem>
                                  <FormLabel>
                                    {conf.label ?? formatLabel(key)}
                                  </FormLabel>
                                  <FormControl>
                                    <select
                                      {...field}
                                      className="w-full border px-3 py-2 rounded"
                                    >
                                      <option value="">
                                        {t("form.select")}
                                      </option>
                                      <option value="none">
                                        {t(
                                          "stepone.form.educationOptions.none",
                                        )}
                                      </option>
                                      <option value="primary">
                                        {t(
                                          "stepone.form.educationOptions.primary",
                                        )}
                                      </option>
                                      <option value="secondary">
                                        {t(
                                          "stepone.form.educationOptions.secondary",
                                        )}
                                      </option>
                                      <option value="Diploma">
                                        {t(
                                          "stepone.form.educationOptions.diploma",
                                        )}
                                      </option>
                                      <option value="Bachelor">
                                        {t(
                                          "stepone.form.educationOptions.bachelor",
                                        )}
                                      </option>
                                      <option value="Master">
                                        {t(
                                          "stepone.form.educationOptions.masters",
                                        )}
                                      </option>
                                      <option value="Doctorate">
                                        {t(
                                          "stepone.form.educationOptions.doctorate",
                                        )}
                                      </option>
                                    </select>
                                  </FormControl>
                                  {comment && (
                                    <Alert
                                      variant="destructive"
                                      className="mt-3 bg-red-50/50 border-red-100"
                                    >
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertTitle className="text-xs font-bold">
                                        {t("resubmit.reviewerFeedback")}
                                      </AlertTitle>
                                      <AlertDescription className="text-sm">
                                        {comment}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </FormItem>
                              )}
                            />
                          ) : (
                            <FormField
                              control={form.control as any}
                              name={conf.formName as any}
                              render={({ field }: any) => (
                                <FormItem>
                                  <FormLabel>
                                    {conf.label ?? formatLabel(key)}
                                  </FormLabel>
                                  <FormControl>
                                    {conf.kind === "date" ? (
                                      <Input type="date" {...field} />
                                    ) : conf.kind === "number" ? (
                                      <Input
                                        type="number"
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                          field.onChange(e.target.valueAsNumber)
                                        }
                                      />
                                    ) : (
                                      <Input {...field} />
                                    )}
                                  </FormControl>
                                  {comment && (
                                    <Alert
                                      variant="destructive"
                                      className="mt-3 bg-red-50/50 border-red-100"
                                    >
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertTitle className="text-xs font-bold">
                                        {t("resubmit.reviewerFeedback")}
                                      </AlertTitle>
                                      <AlertDescription className="text-sm">
                                        {comment}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right: files card */}
            <Card className="w-full lg:w-2/5 shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  {t("resubmit.filesToReplace")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {fileFields.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500 italic">
                        {t("resubmit.noFiles")}
                      </p>
                    </div>
                  ) : (
                    fileFields.map((key) => {
                      const conf = FIELD_MAP[key] ?? {
                        kind: "file",
                        formName: key,
                      };
                      const comment = commentsMap[key];
                      const existingFile = application.files?.find(
                        (f: any) =>
                          f.fieldName === key ||
                          f.fieldName === conf.formName ||
                          f.fileName === key ||
                          f.publicId === key,
                      );
                      return (
                        <div key={key}>
                          <FormField
                            control={form.control as any}
                            name={conf.formName as any}
                            render={({ field }: any) => (
                              <FormItem>
                                <FormLabel>
                                  {conf.label ?? formatLabel(key)}
                                </FormLabel>
                                <FormControl>
                                  <FileDragAndDrop
                                    value={field.value ? [field.value] : []}
                                    onChange={(files) =>
                                      field.onChange(files[0])
                                    }
                                    maxFiles={1}
                                    acceptedFileTypes={[
                                      "application/pdf",
                                      "image/png",
                                      "image/jpeg",
                                    ]}
                                    maxSize={10 * 1024 * 1024}
                                    error={
                                      (form.formState as any).errors?.[
                                        conf.formName
                                      ]?.message
                                    }
                                  />
                                </FormControl>
                                {comment && (
                                  <Alert
                                    variant="destructive"
                                    className="mt-3 bg-red-50/50 border-red-100"
                                  >
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className="text-xs font-bold">
                                      {t("resubmit.reviewerFeedback")}
                                    </AlertTitle>
                                    <AlertDescription className="text-sm">
                                      {comment}
                                    </AlertDescription>
                                  </Alert>
                                )}
                                {existingFile && (
                                  <div className="mt-2 text-right">
                                    <Button
                                      className="hover:cursor-pointer border-blue-200 rounded-lg text-blue-500 hover:text-blue-600"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        viewRemoteFile(existingFile.publicId)
                                      }
                                    >
                                      <Eye className="w-4 h-4 mr-2" />{" "}
                                      {t("resubmit.viewExisting")}
                                    </Button>
                                  </div>
                                )}
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() =>
                onSubmit(form.getValues() as ApplicationStepOneType)
              }
              disabled={submitting}
            >
              {submitting ? t("form.submitting") : t("form.resubmit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
