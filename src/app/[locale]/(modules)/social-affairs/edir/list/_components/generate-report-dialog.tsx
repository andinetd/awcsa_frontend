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
import { useGenerateEdirReportMutation } from "@/hooks/social-affairs"; // Make sure this is exported correctly
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
import { GenerateReportPayload } from "@/api/social-affairs/generateEdirReport";

const AVAILABLE_COLUMNS = [
  { id: "name", label: "Association Name" },
  { id: "id", label: "ID" },
  { id: "phoneNumber", label: "Phone Number" },
  { id: "subCity", label: "Sub City" },
  { id: "woreda", label: "Woreda" },
  { id: "bankAccountNumber", label: "Bank Account Number" },
  { id: "establishmentDate", label: "Establishment Date" },
  { id: "members", label: "Members" },
];

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
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "name",
    "id",
    "phoneNumber",
    "subCity",
    "woreda",
    "bankAccountNumber",
    "establishmentDate",
    "members",
  ]);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  const handleGenerate = () => {
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
        const blob = new Blob([data], {
          type:
            format === "EXCEL"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const extension = format === "EXCEL" ? "xlsx" : "pdf";
        link.setAttribute("download", `edir_report.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        toast.success(t("success"));
        setOpen(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error(t("error"));
      },
    });
  };

  const AVAILABLE_COLUMNS = [
    { id: "name", label: t("columns.name") },
    { id: "id", label: t("columns.id") },
    { id: "phoneNumber", label: t("columns.phone") },
    { id: "subCity", label: t("columns.subCity") },
    { id: "woreda", label: t("columns.woreda") },
    { id: "bankAccountNumber", label: t("columns.bankAccount") },
    { id: "establishmentDate", label: t("columns.date") },
    { id: "members", label: t("columns.members") },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          {t("buttons.generate")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("fields.startDate")}</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("fields.endDate")}</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("fields.subCity")}</Label>
              <Input
                placeholder={t("fields.subCity")}
                value={subCity}
                onChange={(e) => setSubCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("fields.woreda")}</Label>
              <Input
                placeholder={t("fields.woreda")}
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("fields.format")}</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as "EXCEL" | "PDF")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCEL">{t("formats.excel")}</SelectItem>
                <SelectItem value="PDF">{t("formats.pdf")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("columns.title")}</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
              {AVAILABLE_COLUMNS.map((col) => (
                <div key={col.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${col.id}`}
                    checked={selectedColumns.includes(col.id)}
                    onCheckedChange={() => handleColumnToggle(col.id)}
                  />
                  <Label htmlFor={`col-${col.id}`} className="text-sm">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("buttons.download")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
