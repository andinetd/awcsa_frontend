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
import { useGenerateEdirReportMutation } from "@/hooks/social-affairs";
import { FileDown, Loader2, Printer, FileText, FileSpreadsheet } from "lucide-react";
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
import { GenerateReportPayload } from "@/api/social-affairs/generateEdirReport";
import {
  SubCitySelect,
  WoredaSelect,
} from "@/components/shared/location-selects";
import { useTranslations } from "next-intl";

export default function GenerateReportDialog() {
  const t = useTranslations("social-affairs.edir.edir.report");
  const [open, setOpen] = useState(false);
  const { mutate: generateReport, isPending } = useGenerateEdirReportMutation();

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subCity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState("");
  const [format, setFormat] = useState<"EXCEL" | "PDF">("EXCEL");
  const [reportType, setReportType] = useState<"SUMMARY" | "PER_EDIR_DOSSIER">("SUMMARY");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "name",
    "registrationNumber",
    "phoneNumber",
    "subCity",
    "woreda",
    "status",
    "bankAccountNumber",
    "establishmentDate",
  ]);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  const handleGenerate = (previewInBrowser = false) => {
    const payload: GenerateReportPayload = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      subCity: subCity || undefined,
      woreda: woreda || undefined,
      selectedColumns,
      format,
    };

    generateReport(payload, {
      onSuccess: (data) => {
        const mimeType =
          format === "EXCEL"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf";
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);

        if (previewInBrowser && format === "PDF") {
          window.open(url, "_blank");
          toast.success(t("success"));
          setOpen(false);
          return;
        }

        const link = document.createElement("a");
        link.href = url;
        const extension = format === "EXCEL" ? "xlsx" : "pdf";
        link.setAttribute(
          "download",
          `edir_report_${new Date().toISOString().split("T")[0]}.${extension}`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        toast.success(t("success"));
        setOpen(false);
      },
      onError: (error: any) => {
        console.error(error);
        toast.error(error?.message || t("error"));
      },
    });
  };

  const AVAILABLE_COLUMNS = [
    { id: "name", label: t("columns.name") },
    { id: "registrationNumber", label: t("columns.registrationNumber") },
    { id: "phoneNumber", label: t("columns.phone") },
    { id: "subCity", label: t("columns.subCity") },
    { id: "woreda", label: t("columns.woreda") },
    { id: "status", label: t("columns.status") },
    { id: "registerLevel", label: t("columns.registerLevel") },
    { id: "bankAccountNumber", label: t("columns.bankAccount") },
    { id: "managementMale", label: t("columns.managementMale") },
    { id: "managementFemale", label: t("columns.managementFemale") },
    { id: "generalMale", label: t("columns.generalMale") },
    { id: "generalFemale", label: t("columns.generalFemale") },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 text-xs font-semibold rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5">
          <FileDown className="w-3.5 h-3.5" />
          {t("buttons.generate")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            <FileDown className="w-4 h-4 text-[#1769AA]" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">{t("fields.startDate")}</Label>
              <Input
                type="date"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">{t("fields.endDate")}</Label>
              <Input
                type="date"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">{t("fields.subCity")}</Label>
              <SubCitySelect
                value={subCity}
                onValueChange={setSubCity}
                placeholder={t("fields.subCity")}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">{t("fields.woreda")}</Label>
              <WoredaSelect
                value={woreda}
                onValueChange={setWoreda}
                subCity={subCity}
                placeholder={t("fields.woreda")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">{t("reportType")}</Label>
              <Select
                value={reportType}
                onValueChange={(v) => {
                  const val = v as "SUMMARY" | "PER_EDIR_DOSSIER";
                  setReportType(val);
                  if (val === "PER_EDIR_DOSSIER") {
                    setFormat("PDF");
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                  <SelectValue>
                    {reportType === "SUMMARY" ? t("reportTypeOptions.summary") : t("reportTypeOptions.perEdirDossier")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="SUMMARY" className="text-xs rounded-xs">
                    {t("reportTypeOptions.summary")}
                  </SelectItem>
                  <SelectItem value="PER_EDIR_DOSSIER" className="text-xs rounded-xs">
                    {t("reportTypeOptions.perEdirDossier")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">{t("fields.format")}</Label>
              <Select
                value={format}
                disabled={reportType === "PER_EDIR_DOSSIER"}
                onValueChange={(v) => setFormat(v as "EXCEL" | "PDF")}
              >
                <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white">
                  <SelectValue>
                    {format === "EXCEL" ? t("formats.excel") : t("formats.pdf")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xs border-[#E3E7EB]">
                  <SelectItem value="EXCEL" className="text-xs rounded-xs flex items-center gap-1.5">
                    {t("formats.excel")}
                  </SelectItem>
                  <SelectItem value="PDF" className="text-xs rounded-xs flex items-center gap-1.5">
                    {t("formats.pdf")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {reportType === "PER_EDIR_DOSSIER" ? (
            <div className="rounded-xs border border-[#BCD5EA] bg-[#E8F2FA] p-3 text-xs text-slate-700 font-medium">
              {t("perEdirDossierHint")}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">{t("columns.title")}</Label>
              <div className="grid grid-cols-2 gap-2 border border-[#E3E7EB] rounded-xs p-3 bg-slate-50/30">
                {AVAILABLE_COLUMNS.map((col) => (
                  <div key={col.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`col-${col.id}`}
                      className="rounded-xs data-[state=checked]:bg-[#1769AA] data-[state=checked]:border-[#1769AA]"
                      checked={selectedColumns.includes(col.id)}
                      onCheckedChange={() => handleColumnToggle(col.id)}
                    />
                    <Label htmlFor={`col-${col.id}`} className="text-xs text-slate-700 cursor-pointer">
                      {col.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
          <Button
            variant="outline"
            className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("buttons.cancel")}
          </Button>

          {format === "PDF" && (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleGenerate(true)}
              className="h-8 text-xs rounded-xs border-[#BCD5EA] text-[#1769AA] hover:bg-[#E8F2FA] font-semibold gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              {t("buttons.printPreview")}
            </Button>
          )}

          <Button
            onClick={() => handleGenerate(false)}
            disabled={isPending}
            className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : format === "EXCEL" ? (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            {t("buttons.download")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
