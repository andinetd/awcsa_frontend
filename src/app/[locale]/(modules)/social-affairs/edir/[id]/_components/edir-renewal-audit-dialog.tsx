"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Edir } from "@/api/social-affairs/edir";
import {
  useRenewEdirMutation,
  useUpdateEdirMutation,
} from "@/hooks/social-affairs";
import { uploadEdirDocument } from "@/api/social-affairs/accreditation-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
import {
  RefreshCw,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface EdirRenewalAuditDialogProps {
  edir: Edir;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onRenewalSuccess?: (renewedEdir: Edir) => void;
}

export default function EdirRenewalAuditDialog({
  edir,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onRenewalSuccess,
}: EdirRenewalAuditDialogProps) {
  const t = useTranslations("social-affairs.edir.edir-details.actions.renewDialog");
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
  };

  const renewMutation = useRenewEdirMutation();
  const updateMutation = useUpdateEdirMutation();

  // Automatically select the current date when performing renewal
  const todayDate = new Date().toISOString().slice(0, 10);
  const [renewalDate, setRenewalDate] = useState<string>(todayDate);

  // Directive 151/2016 Article 7 audit compliance checklist
  const [auditedByCommittee, setAuditedByCommittee] = useState<boolean>(
    edir.assetsAuditedByAuditCommittee ?? true
  );
  const [approvedByAssembly, setApprovedByAssembly] = useState<boolean>(
    edir.assetsApprovedByGeneralAssembly ?? true
  );
  const [penaltyApplied, setPenaltyApplied] = useState<boolean>(
    edir.renewalPenaltyApplied ?? false
  );

  // Synchronize state whenever dialog opens or edir prop updates
  React.useEffect(() => {
    if (open) {
      setRenewalDate(new Date().toISOString().slice(0, 10));
      setAuditedByCommittee(edir.assetsAuditedByAuditCommittee ?? true);
      setApprovedByAssembly(edir.assetsApprovedByGeneralAssembly ?? true);
      setPenaltyApplied(edir.renewalPenaltyApplied ?? false);
    }
  }, [open, edir]);

  // Optional Audit Report document upload
  const [auditFiles, setAuditFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmRenewal = async () => {
    if (!auditedByCommittee || !approvedByAssembly) {
      toast.error(t("needAuditWarning"));
      return;
    }

    setIsSubmitting(true);
    try {
      const performedIsoDate = renewalDate
        ? new Date(renewalDate).toISOString()
        : new Date().toISOString();

      // 1. Upload audit document if provided
      if (auditFiles.length > 0) {
        await uploadEdirDocument(auditFiles[0], "AUDIT_REPORT");
      }

      // 2. Complete annual registration renewal (backend automatically assigns renewedForYear)
      const renewedEdir = await renewMutation.mutateAsync({
        id: edir.id!,
      });

      // 3. Persist audit compliance flags and exact renewal date on Edir
      const updatedEdir = await updateMutation.mutateAsync({
        id: edir.id!,
        data: {
          assetsAuditedByAuditCommittee: auditedByCommittee,
          assetsApprovedByGeneralAssembly: approvedByAssembly,
          renewalPenaltyApplied: penaltyApplied,
          lastRenewedAt: performedIsoDate,
          certificateIssuedAt: performedIsoDate,
        },
      });

      const finalizedEdir: Edir = {
        ...renewedEdir,
        ...updatedEdir,
        lastRenewedAt: performedIsoDate,
        certificateIssuedAt: performedIsoDate,
        assetsAuditedByAuditCommittee: auditedByCommittee,
        assetsApprovedByGeneralAssembly: approvedByAssembly,
        renewalPenaltyApplied: penaltyApplied,
      };

      setOpen(false);
      onRenewalSuccess?.(finalizedEdir);
    } catch (error: any) {
      toast.error(error?.message || "Failed to complete renewal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-xl rounded-xs border-[#E3E7EB] bg-white p-6 shadow-xl">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1769AA]" />
            <DialogTitle className="text-base font-bold font-mono text-[#0B1F3A]">
              {t("title")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Institutional guidance banner */}
          <div className="rounded-xs border border-[#BCD5EA] bg-[#E8F2FA]/60 p-3 text-xs text-[#0B1F3A] flex items-start gap-2.5 font-mono">
            <FileCheck2 className="w-4 h-4 text-[#1769AA] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{t("directiveReference")}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {edir.name} {edir.registrationNumber ? `(${edir.registrationNumber})` : ""}
              </p>
            </div>
          </div>

          {/* Renewal Date */}
          <div className="space-y-1.5 font-mono">
            <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
              {t("dateLabel")}
            </Label>
            <Input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs max-w-sm focus-visible:ring-1 focus-visible:ring-[#1769AA]"
            />
          </div>

          {/* Mandatory Audit Checklist per Directive Article 7 */}
          <div className="space-y-3 rounded-xs border border-[#E3E7EB] bg-slate-50/50 p-3.5">
            <p className="text-xs font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("checklistTitle")}
            </p>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <Checkbox
                  checked={auditedByCommittee}
                  onCheckedChange={(checked) => setAuditedByCommittee(Boolean(checked))}
                  className="mt-0.5 rounded-xs"
                />
                <span className="text-xs text-slate-800 leading-tight">
                  {t("auditCommittee")}
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <Checkbox
                  checked={approvedByAssembly}
                  onCheckedChange={(checked) => setApprovedByAssembly(Boolean(checked))}
                  className="mt-0.5 rounded-xs"
                />
                <span className="text-xs text-slate-800 leading-tight">
                  {t("generalAssembly")}
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-[#E3E7EB]">
                <Checkbox
                  checked={penaltyApplied}
                  onCheckedChange={(checked) => setPenaltyApplied(Boolean(checked))}
                  className="mt-0.5 rounded-xs"
                />
                <span className="text-xs text-slate-600 leading-tight">
                  {t("penaltyLabel")}
                </span>
              </label>
            </div>
          </div>

          {/* Optional Audit Document Dropzone */}
          <div className="space-y-2 pt-1 font-mono">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-[#1769AA]" />
              {t("documentTitle")}
            </Label>
            <div className="rounded-xs border border-[#E3E7EB] p-2 bg-slate-50/20">
              <FileDragAndDrop
                value={auditFiles}
                onChange={setAuditFiles}
                maxFiles={1}
                acceptedFileTypes={[
                  "application/pdf",
                  "image/jpeg",
                  "image/png",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ]}
              />
            </div>
            {auditFiles.length > 0 && (
              <p className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-xs">
                ✓ {t("documentUploaded")}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleConfirmRenewal}
            disabled={isSubmitting || !auditedByCommittee || !approvedByAssembly}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`}
            />
            <span>{isSubmitting ? t("renewing") : t("confirm")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
