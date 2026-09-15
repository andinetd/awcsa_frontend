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
import { FileDown, Loader2 } from "lucide-react";
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

const COLUMNS_BY_CATEGORY: Record<string, { id: string; label: string }[]> = {
  REGISTRATION: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
    { id: "category", label: "Category (DISABLED/ELDERLY)" },
    { id: "educationLevel", label: "Education Level" },
    { id: "occupation", label: "Occupation" },
    { id: "disabilityType", label: "Disability Type" },
    { id: "cause", label: "Cause" },
    { id: "createdAt", label: "Registered At" },
  ],
  TRAINING: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "fullName", label: "Full Name" },
    { id: "trainingType", label: "Training Type" },
    { id: "provider", label: "Provider" },
    { id: "startDate", label: "Start Date" },
    { id: "hasCOC", label: "Has COC (Yes/No)" },
    { id: "completionDate", label: "Completion Date" },
    { id: "remark", label: "Remark" },
  ],
  JOBS: [
    { id: "cityIdNumber", label: "City ID" },
    { id: "fullName", label: "Full Name" },
    { id: "companyIdNumber", label: "Company ID" },
    { id: "jobTitle", label: "Job Title" },
    { id: "startDate", label: "Start Date" },
    { id: "remark", label: "Remark" },
  ],
};

import { useTranslations } from "next-intl";

export default function BeneficiaryReportDialog() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.reports");
  const [open, setOpen] = useState(false);
  const { mutate: generateReport, isPending } =
    useGenerateBeneficiaryReportMutation();

  // Form state
  const [category, setCategory] = useState<
    "REGISTRATION" | "TRAINING" | "JOBS"
  >("REGISTRATION");
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

  const handleCategoryChange = (val: "REGISTRATION" | "TRAINING" | "JOBS") => {
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

  const handleGenerate = () => {
    const payload: BeneficiaryReportPayload = {
      category,
      beneficiaryType,
      startDate,
      endDate,
      subCity,
      woreda,
      format,
      selectedColumns,
    };

    generateReport(payload, {
      onSuccess: () => {
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
        <Button variant="outline" className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50 gap-1.5">
          <FileDown className="w-3.5 h-3.5 text-[#1769AA]" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono">{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGISTRATION" className="text-xs font-mono">
                    {t("categories.registration")}
                  </SelectItem>
                  <SelectItem value="TRAINING" className="text-xs font-mono">
                    {t("categories.training")}
                  </SelectItem>
                  <SelectItem value="JOBS" className="text-xs font-mono">{t("categories.jobs")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">Beneficiary Type</Label>
              <Select
                value={beneficiaryType}
                onValueChange={(v: any) => setBeneficiaryType(v)}
              >
                <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs font-mono">{t("types.all")}</SelectItem>
                  <SelectItem value="DISABLED" className="text-xs font-mono">
                    {t("types.disabled")}
                  </SelectItem>
                  <SelectItem value="ELDERLY" className="text-xs font-mono">{t("types.elderly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">Sub-city</Label>
              <SubCitySelect
                value={subCity}
                onValueChange={setSubCity}
                placeholder="Select sub-city"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">Woreda</Label>
              <WoredaSelect
                value={woreda}
                onValueChange={setWoreda}
                subCity={subCity}
                placeholder="Select woreda"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">Format</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] focus:ring-1 focus:ring-[#1769AA]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCEL" className="text-xs font-mono">Excel (.xlsx)</SelectItem>
                <SelectItem value="PDF" className="text-xs font-mono">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-700">Columns to Include</Label>
            <div className="grid grid-cols-2 gap-2 border border-[#E3E7EB] rounded-xs p-3 bg-slate-50/50 text-xs font-mono max-h-48 overflow-y-auto">
              {availableColumns.map((col) => (
                <div key={col.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${col.id}`}
                    checked={selectedColumns.includes(col.id)}
                    onCheckedChange={() => handleColumnToggle(col.id)}
                    className="rounded-xs border-[#E3E7EB] data-[state=checked]:bg-[#1769AA] data-[state=checked]:border-[#1769AA]"
                  />
                  <Label htmlFor={`col-${col.id}`} className="cursor-pointer text-xs font-mono text-slate-700 select-none">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[#E3E7EB]">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="h-8 px-4 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs font-semibold gap-1.5"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
