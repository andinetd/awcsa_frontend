"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicantInfoSection } from "../_components/applicant-info-section";
import { ApplicationAttachmentsSection } from "../_components/application-attachments-section";
import { ApplicationFieldsSection } from "../_components/application-fields-section";

import { AttachmentDialog } from "../_components/attachment-dialog";
import type { AdoptionApplication, AdoptionApplicationField } from "../page";
import { mockApplications } from "../page";

export default function AdoptionRequestReviewPage() {
  const router = useRouter();
  const params = useParams();

  const application: AdoptionApplication | undefined = mockApplications.find(
    (app) => app.applicationId === params.id
  );
  const [fields, setFields] = useState<
    (AdoptionApplicationField & { showComment: boolean })[]
  >(
    application
      ? application.fields.map((f: AdoptionApplicationField) => ({
          ...f,
          showComment: false,
        }))
      : []
  );
  const [action, setAction] = useState<"approve" | "deny" | "return" | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  // For attachment comments
  const [attachmentFields, setAttachmentFields] = useState(
    application
      ? application.attachments.map((a) => ({
          ...a,
          showComment: false,
          comment: "",
        }))
      : []
  );
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
    setFields((prev: (AdoptionApplicationField & { showComment: boolean })[]) =>
      prev.map(
        (f: AdoptionApplicationField & { showComment: boolean }, i: number) =>
          i === idx ? { ...f, showComment: !f.showComment } : f
      )
    );
  }

  function handleFieldComment(idx: number, value: string) {
    setFields((prev: (AdoptionApplicationField & { showComment: boolean })[]) =>
      prev.map(
        (f: AdoptionApplicationField & { showComment: boolean }, i: number) =>
          i === idx ? { ...f, comment: value } : f
      )
    );
  }

  function handleReturnToApplicant() {
    setAction("return");
    setSubmitting(true);
    // Serialize feedback
    const feedback = fields
      .filter(
        (f: AdoptionApplicationField & { showComment: boolean }) =>
          f.comment && f.comment.trim() !== ""
      )
      .map((f: AdoptionApplicationField & { showComment: boolean }) => ({
        fieldName: f.fieldName,
        comment: f.comment,
      }));
    // Here you would send feedback to backend
    setTimeout(() => {
      setSubmitting(false);
      router.push("../adoption-requests");
    }, 1200);
  }

  function handleAction(type: "approve" | "deny") {
    setAction(type);
    setSubmitting(true);
    // Here you would call an API to update status
    setTimeout(() => {
      setSubmitting(false);
      router.push("../adoption-requests");
    }, 1000);
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

  if (!application) {
    return (
      <SidebarLayout title="Review Adoption Application">
        <div className="max-w-2xl mx-auto p-6 text-center text-lg">
          Application not found.
        </div>
      </SidebarLayout>
    );
  }

  return (
    <>
      {selectedFile && (
        <AttachmentDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          fileName={selectedFile.fileName}
          fileUrl={selectedFile.fileUrl}
        />
      )}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ApplicantInfoSection application={application} />
            <div className="mt-6">
              <ApplicationAttachmentsSection
                attachments={attachmentFields}
                status={application.status}
                onToggle={handleAttachmentToggle}
                onComment={handleAttachmentComment}
                onView={handleViewAttachment}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <ApplicationFieldsSection
              fields={fields}
              status={application.status}
              onToggle={handleFieldToggle}
              onComment={handleFieldComment}
            />
            {application.status === "pending" && (
              <div className="flex gap-2 mt-6">
                <Button
                  variant="destructive"
                  onClick={() => handleAction("deny")}
                  disabled={submitting}
                  className="cursor-pointer"
                >
                  Deny
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
