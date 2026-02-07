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
  const commonT = useTranslations("components.DataTableColumnHeader");
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
        <Button variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend">
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGISTRATION">
                    {t("categories.registration")}
                  </SelectItem>
                  <SelectItem value="TRAINING">
                    {t("categories.training")}
                  </SelectItem>
                  <SelectItem value="JOBS">{t("categories.jobs")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Beneficiary Type</Label>
              <Select
                value={beneficiaryType}
                onValueChange={(v: any) => setBeneficiaryType(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("types.all")}</SelectItem>
                  <SelectItem value="DISABLED">
                    {t("types.disabled")}
                  </SelectItem>
                  <SelectItem value="ELDERLY">{t("types.elderly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sub-city</Label>
              <Input
                placeholder="Enter sub-city"
                value={subCity}
                onChange={(e) => setSubCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Woreda</Label>
              <Input
                placeholder="Enter woreda"
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={(v: any) => setFormat(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCEL">Excel (.xlsx)</SelectItem>
                <SelectItem value="PDF">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Columns to Include</Label>
            <div className="grid grid-cols-2 gap-3 border rounded-xl p-4 bg-slate-50/50 text-sm">
              {availableColumns.map((col) => (
                <div key={col.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${col.id}`}
                    checked={selectedColumns.includes(col.id)}
                    onCheckedChange={() => handleColumnToggle(col.id)}
                  />
                  <Label htmlFor={`col-${col.id}`} className="cursor-pointer">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4 mr-2" />
            )}
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
