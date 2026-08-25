"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useSubmitAssociationMutation,
  useReviewAssociationMutation,
  useUploadAssociationDocumentMutation,
} from "@/hooks/womens";
import { WomenAssociationRecord } from "@/api/womens/associations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
import { CheckCircle2, FileDown, Loader2, Send, XCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";
import { getAssociationDocumentUrl } from "@/api/womens/associations";

interface WorkflowPanelProps {
  record: WomenAssociationRecord;
}

export function AssociationWorkflowPanel({ record }: WorkflowPanelProps) {
  const t = useTranslations("women.associations.workflow");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState<"APPROVED" | "REJECTED" | null>(
    null
  );

  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoBlock
            label={t("enteredBy")}
            name={record.enteredByName}
            date={record.enteredAt}
            signatureDocId={record.entrySignatureDocId}
          />
          <InfoBlock
            label={record.approvalStatus === "REJECTED" ? t("reviewedBy") : t("approvedBy")}
            name={record.approvedByName}
            date={record.approvedAt}
            signatureDocId={record.approvalSignatureDocId}
          />
        </div>

        {record.rejectionReason && (
          <div className="rounded-md border border-destructive/30 bg-red-50 p-3">
            <p className="text-sm font-medium text-destructive">
              {t("rejectionReason")}
            </p>
            <p className="text-sm text-destructive/90">{record.rejectionReason}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t">
          {record.approvalStatus === "DRAFT" && (
            <Button onClick={() => setSubmitOpen(true)} className="gap-2">
              <Send className="w-4 h-4" />
              {t("submit")}
            </Button>
          )}
          {record.approvalStatus === "SUBMITTED" && (
            <>
              <span className="text-sm text-muted-foreground">{t("pendingReview")}</span>
              <div className="flex gap-2 ml-auto">
                <Button variant="destructive" onClick={() => setReviewMode("REJECTED")} className="gap-2">
                  <XCircle className="w-4 h-4" />
                  {t("reject")}
                </Button>
                <Button onClick={() => setReviewMode("APPROVED")} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("approve")}
                </Button>
              </div>
            </>
          )}
          {record.approvalStatus === "APPROVED" && (
            <span className="text-sm text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {t("approvedNotice")}
            </span>
          )}
          {record.approvalStatus === "REJECTED" && (
            <span className="text-sm text-red-700 font-medium flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              {t("rejectedNotice")}
            </span>
          )}
        </div>
      </CardContent>

      <SubmitDialog open={submitOpen} onClose={() => setSubmitOpen(false)} record={record} />
      <ReviewDialog mode={reviewMode} onClose={() => setReviewMode(null)} record={record} />
    </Card>
  );
}

function InfoBlock({
  label,
  name,
  date,
  signatureDocId,
}: {
  label: string;
  name?: string | null;
  date?: string | null;
  signatureDocId?: number | null;
}) {
  const t = useTranslations("women.associations.workflow");
  return (
    <div className="rounded-xl border bg-muted/20 p-4 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold">{name || "-"}</p>
      {date && (
        <p className="text-xs text-muted-foreground">
          {new Date(date).toLocaleString()}
        </p>
      )}
      {signatureDocId != null && (
        <SignatureLink docId={signatureDocId} label={t("viewSignature")} />
      )}
    </div>
  );
}

function SignatureLink({ docId, label }: { docId: number; label: string }) {
  const t = useTranslations("women.associations.workflow");
  const [loading, setLoading] = useState(false);

  const handleView = async () => {
    setLoading(true);
    try {
      const { token } = useAuthStore.getState();
      const response = await axios.get(
        getAssociationDocumentUrl(docId),
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error(t("viewSignatureError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleView}
      disabled={loading}
      className="text-xs text-primary hover:underline inline-flex items-center gap-1 disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
      {label}
    </button>
  );
}

function SubmitDialog({
  open,
  onClose,
  record,
}: {
  open: boolean;
  onClose: () => void;
  record: WomenAssociationRecord;
}) {
  const t = useTranslations("women.associations.workflow");
  const submitMutation = useSubmitAssociationMutation();
  const uploadMutation = useUploadAssociationDocumentMutation();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t("errors.nameRequired"));
      return;
    }
    setError("");
    try {
      let signatureDocId: number | undefined;
      if (file) {
        const uploaded = await uploadMutation.mutateAsync({
          file,
          type: "ENTRY_SIGNATURE",
        });
        signatureDocId = uploaded.data.id;
      }
      submitMutation.mutate(
        {
          id: record.id,
          enteredByName: name.trim(),
          ...(signatureDocId !== undefined ? { entrySignatureDocId: signatureDocId } : {}),
        },
        {
          onSuccess: () => {
            toast.success(t("messages.submitted"));
            setName("");
            setFile(null);
            onClose();
          },
          onError: (err: any) =>
            toast.error(err?.response?.data?.message || err?.message || t("messages.error")),
        },
      );
    } catch (err: any) {
      toast.error(err?.message || t("messages.error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("submitTitle")}</DialogTitle>
          <DialogDescription>{t("submitDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("enteredByNameLabel")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("enteredByNamePlaceholder")}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label>
              {t("entrySignature")}{" "}
              <span className="text-muted-foreground font-normal">({t("optional")})</span>
            </Label>
            <FileDragAndDrop
              value={file ? [file] : []}
              onChange={(files: File[]) => setFile(files[0] ?? null)}
              maxFiles={1}
              acceptedFileTypes={[".pdf", ".png", ".jpg", ".jpeg"]}
              maxSize={5 * 1024 * 1024}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("confirmSubmit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReviewDialog({
  mode,
  onClose,
  record,
}: {
  mode: "APPROVED" | "REJECTED" | null;
  onClose: () => void;
  record: WomenAssociationRecord;
}) {
  const t = useTranslations("women.associations.workflow");
  const reviewMutation = useReviewAssociationMutation();
  const uploadMutation = useUploadAssociationDocumentMutation();
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const isReject = mode === "REJECTED";

  const handleConfirm = async () => {
    if (!name.trim()) {
      setError(t("errors.nameRequired"));
      return;
    }
    if (isReject && !reason.trim()) {
      setError(t("errors.reasonRequired"));
      return;
    }
    setError("");
    try {
      let signatureDocId: number | undefined;
      if (file) {
        const uploaded = await uploadMutation.mutateAsync({
          file,
          type: "APPROVAL_SIGNATURE",
        });
        signatureDocId = uploaded.data.id;
      }
      reviewMutation.mutate(
        {
          id: record.id,
          decision: mode!,
          approvedByName: name.trim(),
          ...(signatureDocId !== undefined ? { approvalSignatureDocId: signatureDocId } : {}),
          ...(isReject ? { rejectionReason: reason.trim() } : {}),
        },
        {
          onSuccess: () => {
            toast.success(isReject ? t("messages.rejected") : t("messages.approved"));
            setName("");
            setReason("");
            setFile(null);
            onClose();
          },
          onError: (err: any) =>
            toast.error(err?.response?.data?.message || err?.message || t("messages.error")),
        },
      );
    } catch (err: any) {
      toast.error(err?.message || t("messages.error"));
    }
  };

  return (
    <Dialog open={mode !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isReject ? t("rejectTitle") : t("approveTitle")}</DialogTitle>
          <DialogDescription>{record.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("approverNameLabel")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("approverNamePlaceholder")}
            />
          </div>
          {isReject && (
            <div className="space-y-2">
              <Label>
                {t("rejectionReason")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("rejectionReasonPlaceholder")}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>
              {t("approvalSignature")}{" "}
              <span className="text-muted-foreground font-normal">({t("optional")})</span>
            </Label>
            <FileDragAndDrop
              value={file ? [file] : []}
              onChange={(files: File[]) => setFile(files[0] ?? null)}
              maxFiles={1}
              acceptedFileTypes={[".pdf", ".png", ".jpg", ".jpeg"]}
              maxSize={5 * 1024 * 1024}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={reviewMutation.isPending}
            className={isReject ? "" : "bg-emerald-600 hover:bg-emerald-700"}
            variant={isReject ? "destructive" : "default"}
          >
            {reviewMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isReject ? t("confirmReject") : t("confirmApprove")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
