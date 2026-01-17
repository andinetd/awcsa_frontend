"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { ApplicantInfoSection } from "../_components/applicant-info-section";
import { ApplicationFieldsSection } from "../_components/application-fields-section";
import { ApplicationAttachmentsSection } from "../_components/application-attachments-section";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { formatAge } from "@/lib/utils";
import { ChildMatchingModal } from "../_components/child-matching-modal";
import { MatchedChildDetail } from "../_components/matched-child-detail-modal";
import { MOCK_MATCHED_CHILD_DATA } from "@/lib/mock-data";

// we'll fetch applications from backend instead of using mockApplications
import type { BackendAdoptionApplication } from "../page";
import { AttachmentDialog } from "../_components/attachment-dialog";
import { BASE_URL } from "@/lib/base-url";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import axios, { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import { Baby, CheckCircle2 } from "lucide-react";
import { useGetMatchedChildDetails } from "@/hooks/adoption/adoption-requests";


export default function AdoptionRequestReviewPage() {
  const router = useRouter();
  const params = useParams();

  const setServiceDataId = useHomeVisitFormStore(
    (state) => state.setServiceDataId
  );

  const [showMatch, setShowMatch] = useState(false);
  const [childId, setChildId] = useState("");

  const [applications, setApplications] = useState<
    BackendAdoptionApplication[]
  >([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isMatchedChildDetailOpen, setIsMatchedChildDetailOpen] =
    useState(false);

  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    let mounted = true;
    async function fetchApplications() {
      setLoadingApps(true);
      try {
        const res = await fetch(
          `${BASE_URL}/adoption/applications?Status=ALL`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => null);
          toast.error(
            `Failed to load application: ${res.status} ${res.statusText}` +
              (text ? ` - ${text}` : "")
          );
          return;
        }
        const data = await res.json().catch(() => null);
        if (!mounted) return;
        if (Array.isArray(data)) {
          setApplications(data);
        } else if (data && Array.isArray(data.items)) {
          setApplications(data.items);
        } else {
          console.warn("Unexpected applications response shape", data);
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error while loading applications");
      } finally {
        if (mounted) setLoadingApps(false);
      }
    }

    fetchApplications();
    return () => {
      mounted = false;
    };
  }, [token]);

  const application: BackendAdoptionApplication | undefined = applications.find(
    (app) =>
      String(app.applicationId) === params.id ||
      app.applicationId === Number(params.id)
  );
  // Build a flat fields array from the backend-shaped application object so the existing
  // ApplicationFieldsSection can render it.
  function buildFieldsFromApp(app: BackendAdoptionApplication) {
    const info = app.applicantInfo || ({} as any);
    const out: {
      fieldName: string;
      fieldKey?: string;
      answer: string;
      showComment: boolean;
      comment?: string;
    }[] = [];
    const push = (name: string, value: any, key?: string) =>
      out.push({
        fieldName: name,
        fieldKey: key,
        answer: value === null || value === undefined ? "" : String(value),
        showComment: false,
        comment: "",
      });

    push("First Name", info.firstName, "firstName");
    push("Last Name", info.lastName, "lastName");
    push("Date of Birth", info.dateOfBirth, "dateOfBirth");
    push("Phone Number", info.phoneNumber, "phoneNumber");
    push("City ID Number", info.cityIdNumber, "cityIdNumber");
    push(
      "Spouse City ID Number",
      info.spouseCityIdNumber ?? "",
      "spouseCityIdNumber"
    );
    push("Address", info.address ?? "", "address");
    push("Education Level", info.educationLevel ?? "", "educationLevel");
    push("Occupation", info.occupation ?? "", "occupation");
    push("Monthly Income", info.monthlyIncome ?? "", "monthlyIncome");

    const pref = app.applicationInfo?.preferredChildren;
    if (pref) {
      push("Preferred Number", pref.number ?? "", "preferredChildren.number");
      push("Preferred Sex", pref.sex ?? "", "preferredChildren.sex");
      push(
        "Preferred Age Min",
        pref.ageRange?.min ?? "",
        "preferredChildren.ageRange.min"
      );
      push(
        "Preferred Age Max",
        pref.ageRange?.max ?? "",
        "preferredChildren.ageRange.max"
      );
    }

    return out;
  }

  const [fields, setFields] = useState<
    {
      fieldName: string;
      fieldKey?: string;
      answer: string;
      showComment: boolean;
      comment?: string;
    }[]
  >([]);
  const [action, setAction] = useState<"approve" | "deny" | "return" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  // For attachment comments
  const [attachmentFields, setAttachmentFields] = useState<
    {
      label: string;
      fieldKey?: string;
      fileName: string;
      fileType?: string;
      url: string;
      showComment: boolean;
      comment?: string;
    }[]
  >([]);

  // when application changes, populate fields/attachments and apply any saved comments
  useEffect(() => {
    if (!application) return;

    // normalize fieldComments from backend (array [{field,comment}] or object map)
    const raw: any =
      (application as any).fieldComments ||
      (application.reviewInfo as any)?.fieldComments ||
      {};
    const commentMap: Record<string, string> = {};
    if (Array.isArray(raw)) {
      raw.forEach((r) => {
        if (r && r.field) commentMap[r.field] = r.comment ?? "";
      });
    } else if (raw && typeof raw === "object") {
      Object.keys(raw).forEach((k) => {
        commentMap[k] = raw[k];
      });
    }

    const built = buildFieldsFromApp(application).map((f) => {
      const key = (f as any).fieldKey ?? f.fieldName;
      const comment = commentMap[key];
      return comment && comment.trim() !== ""
        ? { ...f, comment, showComment: true }
        : f;
    });
    setFields(built);

    const attachments =
      application.applicationInfo?.documents?.map((d) => ({
        label: d.fieldName,
        fieldKey: d.fieldName,
        fileName: d.fileName,
        fileType: d.fileType,
        url: `/api/adoption/files/${d.publicId}`,
        showComment: false,
        comment: "",
      })) || [];
    const attachmentsWithComments = attachments.map((a) => {
      const key = (a as any).fieldKey ?? a.label;
      const comment = commentMap[key];
      return comment && comment.trim() !== ""
        ? { ...a, comment, showComment: true }
        : a;
    });
    setAttachmentFields(attachmentsWithComments);
  }, [application]);
  function handleAttachmentToggle(idx: number) {
    setAttachmentFields((prev) =>
      prev.map((a, i) =>
        i === idx ? { ...a, showComment: !a.showComment } : a
      )
    );
  }

  function handleAttachmentComment(idx: number, value: string) {
    setAttachmentFields((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, comment: value } : a))
    );
  }

  function handleFieldToggle(idx: number) {
    setFields((prev) =>
      prev.map((f, i) =>
        i === idx ? { ...f, showComment: !f.showComment } : f
      )
    );
  }

  function handleFieldComment(idx: number, value: string) {
    setFields((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, comment: value } : f))
    );
  }

  // Return to applicant: send a concise review payload to the backend (no full form resubmission).
  // token is provided above via hook used in fetch; reuse token variable
  const [returnComment, setReturnComment] = useState("");

  async function handleReturnToApplicant() {
    if (!application) return;
    setAction("return");
    setSubmitting(true);

    // Build fieldComments map: { fieldKey: comment }
    const fieldComments: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.comment && f.comment.trim() !== "") {
        // prefer stable key when available
        const key = (f as any).fieldKey ?? f.fieldName;
        fieldComments[key] = f.comment;
      }
    });

    // Include attachment comments as well
    attachmentFields.forEach((a) => {
      if (a.comment && a.comment.trim() !== "") {
        const key = (a as any).fieldKey ?? a.label;
        fieldComments[key] = a.comment;
      }
    });

    const payload = {
      status: "RETURNED",
      comment: returnComment,
      fieldComments: fieldComments,
      subCity: "Bole",
      woreda: "01",
    } as any;

    try {
      const res = await fetch(
        `${BASE_URL}/adoption/applications/${application.applicationId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.message || `Server returned ${res.status}`;
        toast.error(`Failed to return application: ${message}`);
        setSubmitting(false);
        return;
      }

      // try to read updated application from response and update frontend state
      const respBody = await res.json().catch(() => null);
      if (respBody) {
        // Update the shared mockApplications array if present so list page sees changes
        try {
          const idx = applications.findIndex(
            (a) => String(a.applicationId) === String(application.applicationId)
          );
          if (idx !== -1) {
            const prev = applications[idx];
            const updatedApp = {
              ...prev,
              applicationId: respBody.id ?? prev.applicationId,
              status: respBody.status ?? prev.status,
              // prefer client/adoptionData for updated applicant/adoption info
              applicantInfo: {
                ...(prev.applicantInfo || {}),
                ...(respBody.client || {}),
              },
              applicationInfo: {
                ...(prev.applicationInfo || {}),
                documents: prev.applicationInfo?.documents ?? [],
              },
              reviewInfo: {
                remark: respBody.remark ?? prev.reviewInfo?.remark ?? null,
                subCity: respBody.subCity ?? prev.reviewInfo?.subCity ?? null,
                woreda: respBody.woreda ?? prev.reviewInfo?.woreda ?? null,
                createdAt:
                  respBody.createdAt ?? prev.reviewInfo?.createdAt ?? null,
                updatedAt: respBody.updatedAt ?? new Date().toISOString(),
              },
            } as any;

            (updatedApp as any).fieldComments =
              respBody.fieldComments ?? (prev as any).fieldComments;

            setApplications((prevApps) => {
              const arr = [...prevApps];
              arr[idx] = updatedApp as any;
              return arr;
            });

            // refresh local UI state
            setFields(buildFieldsFromApp(updatedApp as any));
            setAttachmentFields(
              (updatedApp as any).applicationInfo.documents.map((d: any) => ({
                label: d.fieldName,
                fieldKey: d.fieldName,
                fileName: d.fileName,
                fileType: d.fileType,
                url: `/api/adoption/files/${d.publicId}`,
                showComment: false,
                comment: "",
              }))
            );
          }
        } catch (e) {
          // ignore update errors
          console.error("Error updating local application after return:", e);
        }
      }

      toast.success("Application returned to applicant");
      setSubmitting(false);
      router.push("../adoption-requests");
    } catch (err) {
      console.error(err);
      toast.error("Network error while returning application");
      setSubmitting(false);
    }
  }

  async function handleAction(type: "approve" | "deny") {
    if (!application) return;
    setAction(type);
    setSubmitting(true);

    // Build fieldComments map: { fieldName: comment }
    const fieldComments: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.comment && f.comment.trim() !== "") {
        const key = (f as any).fieldKey ?? f.fieldName;
        fieldComments[key] = f.comment;
      }
    });

    // Include attachment comments as well (map by label)
    attachmentFields.forEach((a) => {
      if (a.comment && a.comment.trim() !== "") {
        const key = (a as any).fieldKey ?? a.label;
        fieldComments[key] = a.comment;
      }
    });

    const status = type === "approve" ? "PENDING_HOME_VISIT" : "REJECTED";

    const payload = {
      status,
      comment: returnComment,
      fieldComments,
      subCity: "Bole",
      woreda: "01",
    } as any;

    try {
      const res = await fetch(
        `${BASE_URL}/adoption/applications/${application.applicationId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.message || `Server returned ${res.status}`;
        toast.error(`Failed to submit review: ${message}`);
        setSubmitting(false);
        return;
      }

      // try to read updated application from response and update frontend state
      const respBody = await res.json().catch(() => null);
      if (respBody) {
        try {
          const idx = applications.findIndex(
            (a) => String(a.applicationId) === String(application.applicationId)
          );
          if (idx !== -1) {
            const prev = applications[idx];
            const updatedApp = {
              ...prev,
              applicationId: respBody.id ?? prev.applicationId,
              status: respBody.status ?? prev.status,
              applicantInfo: {
                ...(prev.applicantInfo || {}),
                ...(respBody.client || {}),
              },
              applicationInfo: {
                ...(prev.applicationInfo || {}),
                documents: prev.applicationInfo?.documents ?? [],
              },
              reviewInfo: {
                remark: respBody.remark ?? prev.reviewInfo?.remark ?? null,
                subCity: respBody.subCity ?? prev.reviewInfo?.subCity ?? null,
                woreda: respBody.woreda ?? prev.reviewInfo?.woreda ?? null,
                createdAt:
                  respBody.createdAt ?? prev.reviewInfo?.createdAt ?? null,
                updatedAt: respBody.updatedAt ?? new Date().toISOString(),
              },
            } as any;

            (updatedApp as any).fieldComments =
              respBody.fieldComments ?? (prev as any).fieldComments;

            setApplications((prevApps) => {
              const arr = [...prevApps];
              arr[idx] = updatedApp as any;
              return arr;
            });

            setFields(buildFieldsFromApp(updatedApp as any));
            setAttachmentFields(
              (updatedApp as any).applicationInfo.documents.map((d: any) => ({
                label: d.fieldName,
                fieldKey: d.fieldName,
                fileName: d.fileName,
                fileType: d.fileType,
                url: `/api/adoption/files/${d.publicId}`,
                showComment: false,
                comment: "",
              }))
            );
          }
        } catch (e) {
          console.error("Error updating local application after submit:", e);
        }
      }

      toast.success(
        type === "approve" ? "Application approved" : "Application denied"
      );
      setSubmitting(false);
      router.push("../adoption-requests");
    } catch (err) {
      console.error(err);
      toast.error("Network error while submitting review");
      setSubmitting(false);
    }
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    fileName: string;
    fileUrl: string;
  } | null>(null);

  function handleViewAttachment(fileName: string, fileUrl: string) {
    setSelectedFile({ fileName, fileUrl });
    setOpenDialog(true);
  }

    const { data, isLoading, isError, error } =
      useGetMatchedChildDetails(application?.matchedChildId || 0);

  if (loadingApps) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-lg">
        Loading...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-lg">
        Application not found.
      </div>
    );
  }

  return (
    <div title="Review Adoption Application">
      {selectedFile && (
        <AttachmentDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          fileName={selectedFile.fileName}
          fileUrl={selectedFile.fileUrl}
        />
      )}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-7xl mx-auto p-8 space-y-6">
          <ApplicantInfoSection
            application={{
              applicationId: String(application.applicationId),
              applicantName: `${application.applicantInfo.firstName} ${application.applicantInfo.lastName}`,
              status: (application.status || "").toLowerCase(),
              submittedDate: application.reviewInfo?.createdAt ?? "",
            }}
            setServiceDataId={setServiceDataId}
            handleAction={handleAction}
            handleReturnToApplicant={handleReturnToApplicant}
            setIsMatchModalOpen={setIsMatchModalOpen}
            setIsMatchedChildDetailOpen={setIsMatchedChildDetailOpen}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ApplicationAttachmentsSection
                attachments={attachmentFields}
                status={
                  (application.status || "").toUpperCase() === "PENDING_REVIEW"
                    ? "pending"
                    : (application.status || "").toLowerCase()
                }
                onToggle={handleAttachmentToggle}
                onComment={handleAttachmentComment}
                onView={handleViewAttachment}
              />

              <ApplicationFieldsSection
                fields={fields}
                status={
                  (application.status || "").toUpperCase() === "PENDING_REVIEW"
                    ? "pending"
                    : (application.status || "").toLowerCase()
                }
                onToggle={handleFieldToggle}
                onComment={handleFieldComment}
              />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby className="w-5 h-5 text-slate-400" />
                    Adoption Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500">
                        Preferred Sex
                      </span>
                      <span className="font-bold text-slate-900">
                        {application.applicationInfo.preferredChildren?.sex}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500">Quantity</span>
                      <span className="font-bold text-slate-900">
                        {application.applicationInfo.preferredChildren?.number}{" "}
                        Child
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Age Range</span>
                      <span className="font-bold text-slate-900">
                        {formatAge(
                          application.applicationInfo.preferredChildren
                            ?.ageRange?.min
                        )}{" "}
                        -{" "}
                        {formatAge(
                          application.applicationInfo.preferredChildren
                            ?.ageRange?.max
                        )}{" "}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          application.applicationInfo.spouseAgreement
                            ? "text-green-500"
                            : "text-slate-300"
                        }`}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Spouse Agreement
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="lg:col-span-2">
                {/* Return form: overall comment */}
                {(application.status || "").toUpperCase() ===
                  "PENDING_REVIEW" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Overall comment
                      </label>
                      <textarea
                        value={returnComment}
                        onChange={(e) => setReturnComment(e.target.value)}
                        placeholder="Overall comment"
                        className="w-full border rounded p-2 min-h-[80px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChildMatchingModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        applicationId={application.applicationId}
        applicantId={application.applicantInfo.id}
      />
      <MatchedChildDetail
        isOpen={isMatchedChildDetailOpen}
        onClose={() => setIsMatchedChildDetailOpen(false)}
        data={data}
      />
    </div>

  );
}
