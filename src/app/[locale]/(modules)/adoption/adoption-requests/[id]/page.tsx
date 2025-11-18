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

// we'll fetch applications from backend instead of using mockApplications
import type { BackendAdoptionApplication } from "../page";
import { AttachmentDialog } from "../_components/attachment-dialog";
import { BASE_URL } from "@/lib/base-url";
import { useHomeVisitFormStore } from "@/stores/home-visit-store";
import axios, { AxiosError } from "axios";

export default function AdoptionRequestReviewPage() {
  const router = useRouter();
  const params = useParams();
  const setServiceDataId = useHomeVisitFormStore(
    (state) => state.setServiceDataId
  );

  const user = useAuthStore((state) => state.user);

  const [showMatch, setShowMatch] = useState(false);
  const [childId, setChildId] = useState("");

  const [applications, setApplications] = useState<
    BackendAdoptionApplication[]
  >([]);
  const [loadingApps, setLoadingApps] = useState(false);

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

  async function handleMatch() {
    if (!application) return;

    if (!childId || childId.trim() === "") {
      toast.error("Please enter a child ID");
      return;
    }

    const applicantIdNum = user?.id != null ? Number(user.id) : undefined;
    const applicationIdNum = Number(application.applicationId);

    if (
      applicantIdNum == null ||
      isNaN(applicantIdNum) ||
      isNaN(applicationIdNum)
    ) {
      toast.error("Invalid applicant or application id");
      return;
    }

    const payload = {
      childIdFromFacility: childId,
      applicantId: applicantIdNum,
      applicationId: applicationIdNum,
      note: "notes about the match",
    } as any;

   
    try {
      const res = await axios.post(`${BASE_URL}/adoption/matches`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setChildId("");
      setShowMatch(false);
      router.push("../adoption-requests");
      toast.success("Child matched successfully");
    } catch (error) {
      console.error("Error submitting form:", error);

      // extract a useful message from AxiosError if possible
      let message = "Failed to submit home visit feedback. Please try again.";

      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<any>;
        // prefer server-provided message shape
        const respData = axiosErr.response?.data;
        if (respData) {
          if (typeof respData === "string") {
            message = respData;
          } else if (respData.message) {
            message = String(respData.message);
          } else if (respData.errors) {
            try {
              // if errors is array or object, make it readable
              if (Array.isArray(respData.errors)) {
                message = respData.errors
                  .map((e: any) => e.message || JSON.stringify(e))
                  .join("; ");
              } else {
                message = JSON.stringify(respData.errors);
              }
            } catch {
              message = String(respData.errors);
            }
          } else {
            try {
              message = JSON.stringify(respData);
            } catch {
              message = String(respData);
            }
          }
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      // show the extracted message in the toast
      toast.error(message);
      return;
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
        <div className="mb-4 text-2xl">Review Adoption Application</div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* adapt backend application to the small shape ApplicantInfoSection expects */}
            <ApplicantInfoSection
              application={{
                applicationId: String(application.applicationId),
                applicantName: `${application.applicantInfo.firstName} ${application.applicantInfo.lastName}`,
                status: (application.status || "").toLowerCase(),
                submittedDate: application.reviewInfo?.createdAt ?? "",
              }}
            />
            <div className="mt-6">
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
            </div>
          </div>
          <div className="lg:col-span-2">
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

            {/* Return form: overall comment */}
            {(application.status || "").toUpperCase() === "PENDING_REVIEW" && (
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

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleAction("deny")}
                    disabled={submitting}
                    className="cursor-pointer"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={handleReturnToApplicant}
                    disabled={submitting}
                    className="cursor-pointer"
                  >
                    Return to Applicant
                  </Button>
                  <Button
                    onClick={() => handleAction("approve")}
                    disabled={submitting}
                    className="cursor-pointer"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
            {(application.status || "").toUpperCase() ===
              "PENDING_HOME_VISIT" && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {
                    setServiceDataId(String(application.applicationId));
                    router.push("../home-visit/step1");
                  }}
                >
                  Submit Home Visit Feedback
                </Button>
              </div>
            )}
            {(application.status || "").toUpperCase() ===
              "PENDING_APPROVAL" && (
              <div className="mt-6 flex justify-end">
                <div className="space-x-2">
                  <Button
                    onClick={() => {
                      router.push(
                        `/adoption/home-visit/${String(
                          application.applicationId
                        )}/fields`
                      );
                    }}
                  >
                    View Home Visit Feedback
                  </Button>
                  <Button onClick={() => setShowMatch((s) => !s)}>
                    Approve and match child
                  </Button>
                </div>
              </div>
            )}

            {showMatch && (
              <div className="flex items-center gap-2 mt-2 justify-between border p-2 rounded shadow-sm">
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={childId}
                    onChange={(e) => setChildId(e.target.value)}
                    placeholder="Enter child ID number"
                    className="border rounded p-2 w-full"
                  />
                </div>

                <div className="space-x-2">
                  <Button onClick={() => handleMatch()}>Confirm</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setChildId("");
                      setShowMatch(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
