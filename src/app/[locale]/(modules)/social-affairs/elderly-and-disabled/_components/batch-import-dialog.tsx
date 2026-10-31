"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileSpreadsheet,
  Upload,
  Loader2,
  CheckCircle2,
  FileText,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  importBeneficiariesExcel,
  BatchImportResponse,
} from "@/api/beneficiaries/beneficiaries";
import { useQueryClient } from "@tanstack/react-query";

interface BatchImportDialogProps {
  onSuccess?: () => void;
}

export function BatchImportDialog({ onSuccess }: BatchImportDialogProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.registration");
  const locale = useLocale();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [subCity, setSubCity] = useState("Lideta");
  const [woreda, setWoreda] = useState("Woreda 07");
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BatchImportResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith(".xlsx") && !selected.name.endsWith(".xls")) {
        toast.error(
          locale === "am"
            ? "እባክዎ ትክክለኛ የኤክሴል (.xlsx) ፋይል ይምረጡ"
            : "Please select a valid Excel (.xlsx) file"
        );
        return;
      }
      setFile(selected);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error(
        locale === "am"
          ? "እባክዎ መጀመሪያ ፋይል ይምረጡ"
          : "Please select a file first"
      );
      return;
    }

    setIsUploading(true);
    try {
      const data = await importBeneficiariesExcel(file, subCity, woreda);
      setResult(data);
      toast.success(
        locale === "am"
          ? `በተሳካ ሁኔታ ${data.uniqueCitizensResolved} ተጠቃሚዎች ተመዝግበዋል/ተዘምነዋል`
          : `Successfully processed ${data.uniqueCitizensResolved} citizens`
      );
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
      queryClient.invalidateQueries({ queryKey: ["beneficiary-dashboard"] });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (locale === "am"
          ? "ፋይሉን ማካተት አልተቻለም። እባክዎ ቅርጸቱን ያረጋግጡ።"
          : "Failed to import file. Please check format.");
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setResult(null);
    setIsUploading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50 gap-1.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {locale === "am" ? "የኤክሴል መረጃ አስገባ" : "Import Excel"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>
              {locale === "am"
                ? "የኤክሴል መረጃ ማደራጃ (ባች ማስገቢያ)"
                : "Batch Import Excel Data"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">
            {locale === "am"
              ? "የአረጋዊያን የስራ እና የአካል ጉዳተኞች የስልጠና ፍላጎት መረጃዎችን ከኤክሴል ፋይል በቀጥታ ያስገቡ።"
              : "Import elderly work capacity and disabled vocational training records directly from Excel."}
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 pt-2">
            {/* Template Info Card */}
            <div className="rounded-xs border border-sky-200 bg-sky-50/60 p-3 text-xs font-mono text-sky-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Layers className="w-4 h-4 text-sky-700" />
                <span>
                  {locale === "am"
                    ? "የሚደገፉ ሉሆች (Sheets)"
                    : "Supported Worksheets"}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-sky-800">
                <li>
                  <strong className="text-sky-950">የፍላጎት ቅጾች (Needs & Training)</strong>:{" "}
                  {locale === "am"
                    ? "የአረጋዊያን የስራ ፍላጎት፣ የአካል ጉዳተኞች ስልጠና፣ የአካል ድጋፍ መሳሪያ"
                    : "Elderly work capacity, disabled training, assistive devices"}
                </li>
                <li>
                  <strong className="text-sky-950">የወረዳ አረጋውያን መዝገቦች (Woreda Elderly Registers)</strong>:{" "}
                  {locale === "am"
                    ? "mahber (የማህበር አባላት)፣ የሞቱ አረጋዊያን፣ ከቂርቆስ የመጡ፣ ቀ.ድ.ተጠቃሚዎች፣ የጤና መድህን፣ በወረዳው የሚገኙ አረጋውያን"
                    : "mahber (association), deceased, relocated, direct support, health insurance, master census"}
                </li>
              </ul>
            </div>

            {/* Default Location Form */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-mono text-slate-600">
                  {locale === "am" ? "ነባሪ ክፍለ ከተማ" : "Default Sub-City"}
                </Label>
                <Input
                  value={subCity}
                  onChange={(e) => setSubCity(e.target.value)}
                  className="h-8 text-xs font-mono rounded-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-mono text-slate-600">
                  {locale === "am" ? "ነባሪ ወረዳ" : "Default Woreda"}
                </Label>
                <Input
                  value={woreda}
                  onChange={(e) => setWoreda(e.target.value)}
                  className="h-8 text-xs font-mono rounded-xs"
                />
              </div>
            </div>

            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-[#1769AA] rounded-xs p-6 text-center space-y-3 transition-colors bg-slate-50/50">
              <FileSpreadsheet className="w-10 h-10 text-emerald-600 mx-auto" />
              <div>
                <label className="cursor-pointer">
                  <span className="text-xs font-mono font-bold text-[#1769AA] hover:underline">
                    {locale === "am"
                      ? "የኤክሴል (.xlsx) ፋይል ይምረጡ"
                      : "Choose Excel (.xlsx) file"}
                  </span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  {file
                    ? file.name
                    : locale === "am"
                    ? "የመረጃ ማደራጃ ፋይል (.xlsx)"
                    : "data_template.xlsx"}
                </p>
              </div>
              {file && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs"
                onClick={() => setOpen(false)}
                disabled={isUploading}
              >
                {locale === "am" ? "ሰርዝ" : "Cancel"}
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white gap-1.5"
                onClick={handleUpload}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{locale === "am" ? "በማስገባት ላይ..." : "Processing..."}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{locale === "am" ? "አስገባና አደራጅ" : "Upload & Process"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Result Summary Card */
          <div className="space-y-4 pt-2">
            <div className="rounded-xs border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-mono font-bold text-sm">
                  {locale === "am"
                    ? "የኤክሴል መረጃ ማስገባት በተሳካ ሁኔታ ተጠናቋል!"
                    : "Import Process Completed Successfully!"}
                </h4>
              </div>
              <p className="text-xs font-mono text-emerald-800">
                {locale === "am"
                  ? `በአጠቃላይ ${result.totalRowsScanned} ረድፎች ተነበው ${result.uniqueCitizensResolved} ዜጎች ተመዝግበዋል።`
                  : `Scanned ${result.totalRowsScanned} rows, successfully resolving ${result.uniqueCitizensResolved} individual beneficiaries.`}
              </p>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-xs font-mono text-slate-500 block">
                  {locale === "am" ? "አዲስ የተመዘገቡ" : "Created"}
                </span>
                <span className="text-lg font-bold font-mono text-[#0B1F3A]">
                  {result.createdCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-xs font-mono text-slate-500 block">
                  {locale === "am" ? "የተዘመኑ (Existing)" : "Updated"}
                </span>
                <span className="text-lg font-bold font-mono text-[#1769AA]">
                  {result.updatedCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-xs font-mono text-slate-500 block">
                  {locale === "am" ? "አረጋዊያን" : "Elderly"}
                </span>
                <span className="text-lg font-bold font-mono text-slate-800">
                  {result.elderlyProcessedCount}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                <span className="text-xs font-mono text-slate-500 block">
                  {locale === "am" ? "አካል ጉዳተኞች" : "Disabled"}
                </span>
                <span className="text-lg font-bold font-mono text-slate-800">
                  {result.disabledProcessedCount}
                </span>
              </div>
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xs">
                <span className="text-xs font-mono text-emerald-700 block">
                  {locale === "am" ? "የድጋፍ መሳሪያ ጥያቄ" : "Assistive Requests"}
                </span>
                <span className="text-lg font-bold font-mono text-emerald-800">
                  {result.assistiveRequestsCreatedCount ?? 0}
                </span>
              </div>
            </div>

            {/* Targeted Program & Status Flags Breakdown */}
            {((result.associationMemberCount ?? 0) > 0 ||
              (result.directSupportCount ?? 0) > 0 ||
              (result.healthInsuranceCount ?? 0) > 0 ||
              (result.deceasedCount ?? 0) > 0 ||
              (result.relocatedCount ?? 0) > 0 ||
              (result.disabilityLinkedCount ?? 0) > 0) && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-slate-700 block">
                  {locale === "am"
                    ? "የተለዩ ሁኔታዎች እና መርሃ-ግብሮች (Programs & Status):"
                    : "Programs & Status Breakdown:"}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xs">
                    <span
                      className="text-[11px] font-mono text-blue-700 block truncate"
                      title={locale === "am" ? "የማህበር አባላት" : "Association Members"}
                    >
                      {locale === "am" ? "ማህበር" : "Association"}
                    </span>
                    <span className="text-base font-bold font-mono text-blue-900">
                      {result.associationMemberCount ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xs">
                    <span
                      className="text-[11px] font-mono text-amber-700 block truncate"
                      title={locale === "am" ? "ቀጥታ ድጋፍ (ቀ.ድ)" : "Direct Support"}
                    >
                      {locale === "am" ? "ቀ.ድ. ተጠቃሚ" : "Direct Support"}
                    </span>
                    <span className="text-base font-bold font-mono text-amber-900">
                      {result.directSupportCount ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 bg-teal-50/70 border border-teal-200 rounded-xs">
                    <span
                      className="text-[11px] font-mono text-teal-700 block truncate"
                      title={locale === "am" ? "የጤና መድህን" : "Health Insurance"}
                    >
                      {locale === "am" ? "የጤና መድህን" : "Health Ins."}
                    </span>
                    <span className="text-base font-bold font-mono text-teal-900">
                      {result.healthInsuranceCount ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xs">
                    <span
                      className="text-[11px] font-mono text-rose-700 block truncate"
                      title={locale === "am" ? "በሞት የተለዩ" : "Deceased"}
                    >
                      {locale === "am" ? "በሞት የተለዩ" : "Deceased"}
                    </span>
                    <span className="text-base font-bold font-mono text-rose-900">
                      {result.deceasedCount ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-xs">
                    <span
                      className="text-[11px] font-mono text-purple-700 block truncate"
                      title={locale === "am" ? "የተዛወሩ (ከሌላ ወረዳ/ክፍለ ከተማ)" : "Relocated"}
                    >
                      {locale === "am" ? "የተዛወሩ" : "Relocated"}
                    </span>
                    <span className="text-base font-bold font-mono text-purple-900">
                      {result.relocatedCount ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xs">
                    <span
                      className="text-[11px] font-mono text-indigo-700 block truncate"
                      title={locale === "am" ? "የአካል ጉዳት ያለባቸው" : "Disability Linked"}
                    >
                      {locale === "am" ? "አካል ጉዳት" : "Disability"}
                    </span>
                    <span className="text-base font-bold font-mono text-indigo-900">
                      {result.disabilityLinkedCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Processed Sheets Breakdown */}
            <div className="border border-slate-200 rounded-xs p-3 space-y-1.5 bg-slate-50/50">
              <span className="text-xs font-mono font-bold text-slate-700 block">
                {locale === "am" ? "የተከናወኑ ሉሆች (Sheets Processed):" : "Sheets Processed:"}
              </span>
              {result.sheetsProcessed.map((s, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs font-mono text-slate-600 border-b border-slate-100 last:border-b-0 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{s.sheetName}</strong>
                  </span>
                  <span className="text-slate-500">{s.rowCount} {locale === "am" ? "ረድፎች" : "rows"}</span>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white"
                onClick={() => setOpen(false)}
              >
                {locale === "am" ? "ተጠናቋል (ዝጋ)" : "Done"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
