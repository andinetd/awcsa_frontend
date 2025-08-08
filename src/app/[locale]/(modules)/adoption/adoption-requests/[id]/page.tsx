"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { mockApplications } from "../page";
import type { AdoptionApplication, AdoptionApplicationField } from "../page";

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
    <SidebarLayout title="Review Adoption Application">
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Application ID</span>
          <span className="font-semibold">{application.applicationId}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Applicant Name</span>
          <span>{application.applicantName}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Status</span>
          <span>{application.status}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Submitted</span>
          <span>{new Date(application.submittedDate).toLocaleString()}</span>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Application Details</h3>
          <div className="space-y-4">
            {fields.map(
              (
                field: AdoptionApplicationField & { showComment: boolean },
                idx: number
              ) => (
                <div
                  key={field.fieldName}
                  className="border rounded p-3 bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-56 inline-block">
                      {field.fieldName}:
                    </span>
                    <span>{field.answer}</span>
                    {application.status === "pending" && (
                      <>
                        <Checkbox
                          checked={field.showComment}
                          onCheckedChange={() => handleFieldToggle(idx)}
                          className="ml-4"
                        />
                        <span className="text-xs text-muted-foreground">
                          Feedback?
                        </span>
                      </>
                    )}
                  </div>
                  {field.showComment && application.status === "pending" && (
                    <div className="mt-2">
                      <Textarea
                        value={field.comment}
                        onChange={(e) =>
                          handleFieldComment(idx, e.target.value)
                        }
                        placeholder={`Comment on ${field.fieldName}`}
                        className="w-full min-h-[60px]"
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Attachments</h3>
          <div className="space-y-4">
            {attachmentFields.map((file, i) => (
              <div key={i} className="border rounded p-3 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="font-medium w-56 inline-block">
                    {file.label}:
                  </span>
                  <a
                    href={file.url}
                    download
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.fileName}
                  </a>
                  {application.status === "pending" && (
                    <>
                      <Checkbox
                        checked={file.showComment}
                        onCheckedChange={() => handleAttachmentToggle(i)}
                        className="ml-4"
                      />
                      <span className="text-xs text-muted-foreground">
                        Feedback?
                      </span>
                    </>
                  )}
                </div>
                {file.showComment && application.status === "pending" && (
                  <div className="mt-2">
                    <Textarea
                      value={file.comment}
                      onChange={(e) =>
                        handleAttachmentComment(i, e.target.value)
                      }
                      placeholder={`Comment on ${file.label}`}
                      className="w-full min-h-[60px]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {application.status === "pending" && (
          <div className="flex gap-2 mt-6">
            <Button
              variant="destructive"
              onClick={() => handleAction("deny")}
              disabled={submitting}
            >
              Deny
            </Button>
            <Button onClick={handleReturnToApplicant} disabled={submitting}>
              Return to Applicant
            </Button>
            <Button
              onClick={() => handleAction("approve")}
              disabled={submitting}
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
