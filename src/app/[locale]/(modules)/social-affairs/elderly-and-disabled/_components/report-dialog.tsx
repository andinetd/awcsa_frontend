"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGenerateBeneficiaryReportMutation } from "@/hooks/beneficiaries";
import { FileDown, Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BeneficiaryReportPayload,
  BeneficiaryType,
} from "@/api/beneficiaries/types";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";
import { useTranslations } from "next-intl";

type CategoryKey =
  | "REGISTRATION"
  | "SERVICE"
  | "SUPPORT"
  | "TRAINING"
  | "JOBS"
  | "ELIGIBILITY";

const COLUMNS_BY_CATEGORY: Record<CategoryKey, { id: string; label: string }[]> = {
  REGISTRATION: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "faydaId", label: "Fayda ID" },
    { id: "fullName", label: "Full Name" },
    { id: "category", label: "Category (DISABLED/ELDERLY)" },
    { id: "sex", label: "Sex" },
    { id: "age", label: "Age" },
    { id: "phoneNumber", label: "Phone Number" },
    { id: "subCity", label: "Sub City" },
    { id: "woreda", label: "Woreda" },
    { id: "educationLevel", label: "Education Level" },
    { id: "employmentStatus", label: "Employment Status" },
    { id: "disabilityType", label: "Disability Type" },
    { id: "disabilitySeverity", label: "Disability Severity" },
    { id: "cause", label: "Cause" },
    { id: "supportConfirmed", label: "Support Confirmed" },
    { id: "registeredAt", label: "Registered At" },
  ],
  SERVICE: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "faydaId", label: "Fayda ID" },
    { id: "fullName", label: "Full Name" },
    { id: "serviceType", label: "Service Type" },
    { id: "status", label: "Status" },
    { id: "requestDate", label: "Request Date" },
    { id: "serviceDate", label: "Service Date" },
    { id: "subCity", label: "Sub City" },
    { id: "woreda", label: "Woreda" },
    { id: "responsibleOffice", label: "Responsible Office" },
  ],
  SUPPORT: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "faydaId", label: "Fayda ID" },
    { id: "fullName", label: "Full Name" },
    { id: "serviceType", label: "Service Type" },
    { id: "status", label: "Status" },
    { id: "amount", label: "Allowance Amount" },
    { id: "deviceType", label: "Assistive Device" },
    { id: "requestDate", label: "Request Date" },
  ],
  TRAINING: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "faydaId", label: "Fayda ID" },
    { id: "fullName", label: "Full Name" },
    { id: "trainingType", label: "Training Type" },
    { id: "provider", label: "Provider" },
    { id: "startDate", label: "Start Date" },
    { id: "completionDate", label: "Completion Date" },
    { id: "hasCOC", label: "Has COC" },
  ],
  JOBS: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "faydaId", label: "Fayda ID" },
    { id: "fullName", label: "Full Name" },
    { id: "companyIdNumber", label: "Company ID" },
    { id: "jobTitle", label: "Job Title" },
    { id: "startDate", label: "Start Date" },
    { id: "remark", label: "Remark" },
  ],
  ELIGIBILITY: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "faydaId", label: "Fayda ID" },
    { id: "fullName", label: "Full Name" },
    { id: "residencyVerified", label: "Residency Verified" },
    { id: "communityConfirmation", label: "Community Confirmed" },
    { id: "medicalStatus", label: "Medical Verification" },
    { id: "decision", label: "Assessment Decision" },
    { id: "decisionDate", label: "Decision Date" },
  ],
};

export default function BeneficiaryReportDialog() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.reports");
  const [open, setOpen] = useState(false);
  const { mutate: generateReport, isPending } =
    useGenerateBeneficiaryReportMutation();

  // Form state
  const [category, setCategory] = useState<CategoryKey>("REGISTRATION");
  const [beneficiaryType, setBeneficiaryType] = useState<
    BeneficiaryType | "ALL"
  >("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subCity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState("");
  const [format, setFormat] = useState<"EXCEL" | "PDF">("EXCEL");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    COLUMNS_BY_CATEGORY.REGISTRATION.map((col) => col.id),
  );

  const availableColumns = COLUMNS_BY_CATEGORY[category] || [];

  const handleCategoryChange = (val: CategoryKey) => {
    setCategory(val);
    setSelectedColumns(COLUMNS_BY_CATEGORY[val].map((col) => col.id));
  };

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  const handleGenerate = (previewInBrowser = false) => {
    const payload: BeneficiaryReportPayload = {
      category,
      beneficiaryType,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      subCity: subCity || undefined,
      woreda: woreda || undefined,
      format,
      selectedColumns,
    };

    generateReport(payload, {
      onSuccess: (data: Blob) => {
        const mimeType =
          format === "EXCEL"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf";
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        if (previewInBrowser && format === "PDF") {
          window.open(url, "_blank");
          toast.success("Print preview opened in new tab");
          setOpen(false);
          return;
        }

        const link = document.createElement("a");
        link.href = url;
        const extension = format === "EXCEL" ? "xlsx" : "pdf";
        link.setAttribute(
          "download",
          `beneficiary_report_${category.toLowerCase()}_${new Date().toISOString().split("T")[0]}.${extension}`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        toast.success("Report generated and downloaded successfully");
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to generate report");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50 gap-1.5"
        >
          <FileDown className="w-3.5 h-3.5 text-[#1769AA]" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A] flex items-center gap-2">
            <FileDown className="w-4 h-4 text-[#1769AA]" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                Report Category
              </Label>
              <Select value={category} onValueChange={(val: any) => handleCategoryChange(val)}>
                <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono text-xs">
                  <SelectItem value="REGISTRATION">{t("categories.registration")}</SelectItem>
                  <SelectItem value="SERVICE">{t("categories.SERVICE")}</SelectItem>
                  <SelectItem value="SUPPORT">{t("categories.SUPPORT")}</SelectItem>
                  <SelectItem value="TRAINING">{t("categories.training")}</SelectItem>
                  <SelectItem value="JOBS">{t("categories.jobs")}</SelectItem>
                  <SelectItem value="ELIGIBILITY">{t("categories.ELIGIBILITY")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                Beneficiary Group
              </Label>
              <Select
                value={beneficiaryType}
                onValueChange={(v: any) => setBeneficiaryType(v)}
              >
                <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-mono text-xs">
                  <SelectItem value="ALL">{t("types.all")}</SelectItem>
                  <SelectItem value="DISABLED">{t("types.disabled")}</SelectItem>
                  <SelectItem value="ELDERLY">{t("types.elderly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                Start Date
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                End Date
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                Sub-city
              </Label>
              <SubCitySelect
                value={subCity}
                onValueChange={setSubCity}
                placeholder="All Sub-cities"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                Woreda
              </Label>
              <WoredaSelect
                value={woreda}
                onValueChange={setWoreda}
                subCity={subCity}
                placeholder="All Woredas"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
              Export Format
            </Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="font-mono text-xs">
                <SelectItem value="EXCEL">Excel Workbook (.xlsx)</SelectItem>
                <SelectItem value="PDF">PDF Document (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">
                Columns to Include
              </Label>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedColumns.length} of {availableColumns.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 border border-[#E3E7EB] rounded-xs p-3 bg-slate-50/50 text-xs font-mono max-h-44 overflow-y-auto">
              {availableColumns.map((col) => (
                <div key={col.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${col.id}`}
                    checked={selectedColumns.includes(col.id)}
                    onCheckedChange={() => handleColumnToggle(col.id)}
                    className="rounded-xs border-[#E3E7EB] data-[state=checked]:bg-[#1769AA] data-[state=checked]:border-[#1769AA]"
                  />
                  <Label
                    htmlFor={`col-${col.id}`}
                    className="cursor-pointer text-xs font-mono text-slate-700 select-none truncate"
                  >
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#E3E7EB]">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50 text-slate-700"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {format === "PDF" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleGenerate(true)}
                disabled={isPending}
                className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs border-[#BCD5EA] bg-[#F2F7FB] text-[#1769AA] hover:bg-[#E1EFF9] gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Printer className="w-3.5 h-3.5" />
                )}
                <span>Print / Preview</span>
              </Button>
            )}

            <Button
              onClick={() => handleGenerate(false)}
              disabled={isPending}
              className="h-8 px-4 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs font-semibold gap-1.5"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>Download Report</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
