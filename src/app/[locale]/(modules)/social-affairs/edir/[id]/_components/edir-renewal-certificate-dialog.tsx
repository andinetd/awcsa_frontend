"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Edir } from "@/api/social-affairs/edir";
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
import { Printer, Award, FileText, CheckCircle2 } from "lucide-react";
import { printEdirRenewalCertificate } from "@/lib/pdf/print-edir-renewal-certificate";

interface EdirRenewalCertificateDialogProps {
  edir: Edir;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EdirRenewalCertificateDialog({
  edir,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EdirRenewalCertificateDialogProps) {
  const t = useTranslations("social-affairs.edir.edir-details.actions.certificate");
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

  const defaultRefNumber = edir.registrationNumber || "";
  const defaultIssueDate = React.useMemo(() => {
    const raw = edir.certificateIssuedAt || edir.lastRenewedAt;
    if (raw) {
      try {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          return d.toISOString().slice(0, 10);
        }
      } catch {
        // ignore and fallback
      }
    }
    return new Date().toISOString().slice(0, 10);
  }, [edir.certificateIssuedAt, edir.lastRenewedAt]);

  const [officerName, setOfficerName] = useState("");
  const [refNumber, setRefNumber] = useState(defaultRefNumber);
  const [issueDate, setIssueDate] = useState(defaultIssueDate);

  React.useEffect(() => {
    setIssueDate(defaultIssueDate);
  }, [defaultIssueDate]);

  React.useEffect(() => {
    if (edir.registrationNumber) {
      setRefNumber(edir.registrationNumber);
    }
  }, [edir.registrationNumber]);

  const handlePrint = () => {
    printEdirRenewalCertificate(edir, {
      officerName,
      refNumber,
      issueDate,
    });
    setOpen(false);
  };

  const totalMembers =
    (edir.managementMale || 0) +
    (edir.managementFemale || 0) +
    (edir.generalMale || 0) +
    (edir.generalFemale || 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !isControlled && (
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-semibold rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5 cursor-pointer text-[#1769AA]"
          >
            <Award className="w-3.5 h-3.5" />
            <span>{t("label")}</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl rounded-xs border-[#E3E7EB] bg-white p-6 shadow-xl">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1769AA]" />
            <DialogTitle className="text-base font-bold font-mono text-[#0B1F3A]">
              {t("dialogTitle")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {t("dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Certificate Input Adjustments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50/70 border border-[#E3E7EB] rounded-xs text-xs font-mono">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                {t("refNumber")}
              </Label>
              <Input
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder={t("refPlaceholder")}
                className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                {t("issueDate")}
              </Label>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                {t("officerName")}
              </Label>
              <Input
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder={t("officerPlaceholder")}
                className="h-7.5 text-xs bg-white border-[#E3E7EB] rounded-xs"
              />
            </div>
          </div>

          {/* Certificate Live Preview Box */}
          <div className="border border-slate-300 rounded-xs p-6 bg-amber-50/20 font-serif text-slate-800 space-y-4 shadow-inner text-sm leading-relaxed">
            <div className="flex justify-between items-start text-xs border-b border-slate-200 pb-2">
              <div>
                <span className="font-bold">ቁጥር:</span> {refNumber || "—"}
              </div>
              <div>
                <span className="font-bold">ቀን:</span> {issueDate || "—"}
              </div>
            </div>

            <div className="text-center font-semibold text-xs text-slate-600">
              በእድሮች እና እድም ምክር ቤቶች የምዝገባ እና እድሳት መመሪያ ቁጥር 151/2016 መሰረት የተሰጠ
            </div>

            <div className="text-center">
              <span className="text-lg font-bold border-b-2 border-black inline-block pb-0.5">
                የምስክር ወረቀት
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p>
                <span className="font-bold">1. የእድሩ ስም:</span>{" "}
                <span className="font-semibold underline underline-offset-4 decoration-dotted">{edir.name}</span>
              </p>
              <p>
                <span className="font-bold">2. እድሩ የሚገኝበት ክ/ከተማ:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{edir.subCity || "—"}</span>{" "}
                <span className="font-bold">ወረዳ:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{edir.woreda || "—"}</span>{" "}
                <span className="font-bold">የቤት ቁጥር:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{edir.houseNumber || "—"}</span>
              </p>
              <p>
                <span className="font-bold">የአባላት ብዛት:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{totalMembers}</span>{" "}
                <span className="font-bold">ወንድ:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{(edir.managementMale || 0) + (edir.generalMale || 0)}</span>{" "}
                <span className="font-bold">ሴት:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{(edir.managementFemale || 0) + (edir.generalFemale || 0)}</span>
              </p>
              <p>
                <span className="font-bold">እድሩ የተቋቋመበት ዓ.ም.:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{edir.establishmentDate?.slice(0, 4) || "—"}</span>
              </p>
              <p>
                <span className="font-bold">እድሩ መጀመሪያ የተመዘገበበት ቀን:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{edir.registrationDate ? new Date(edir.registrationDate).toLocaleDateString("en-GB") : "—"}</span>
              </p>
              <p>
                <span className="font-bold">እድሩ እድሳት ያደረገበት ቀን:</span>{" "}
                <span className="underline underline-offset-4 decoration-dotted">{issueDate}</span>
              </p>
              <p className="pt-2 text-slate-700 italic">
                3. እድሩ በመመሪያ ቁጥር 151/2016 አንቀጽ 7 መሰረት ያሉ መስፈርቶችን አሟልቶ በመገኘቱ ይህ የምስክር ወረቀት ተሰጥቶታል።
              </p>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-slate-200 text-xs">
              <div className="space-y-1">
                <p>
                  <span className="font-bold">እድሳቱን የሰጠው ባለሙያ ስም:</span>{" "}
                  {officerName || "________________________"}
                </p>
                <p>
                  <span className="font-bold">ፊርማ:</span> ________________________
                </p>
                <p>
                  <span className="font-bold">ቀን:</span> {issueDate}
                </p>
              </div>
              <div className="w-16 h-16 border border-dashed border-slate-400 rounded-full flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase">
                ማህተም
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t("print")}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
