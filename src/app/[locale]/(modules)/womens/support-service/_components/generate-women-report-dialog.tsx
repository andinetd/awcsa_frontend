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
import { useGenerateWomenReportMutation } from "@/hooks/womens";
import { useGetServiceTypesQuery } from "@/hooks/support";
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
import { GenerateWomenReportPayload } from "@/api/womens/generateWomenReport";
import { useTranslations } from "next-intl";

const AVAILABLE_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "dateProvided", label: "Date Provided" },
  { id: "serviceType", label: "Service Type" },
  { id: "category", label: "Category" },
  { id: "provider", label: "Provider" },
  { id: "amountOrQuantity", label: "Amount/Quantity" },
  { id: "beneficiaryName", label: "Beneficiary Name" },
  { id: "beneficiaryType", label: "Beneficiary Type" },
  { id: "subCity", label: "Sub City" },
  { id: "woreda", label: "Woreda" },
  { id: "remark", label: "Remark" },
];

export default function GenerateWomenReportDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: generateReport, isPending } =
    useGenerateWomenReportMutation();
  const t = useTranslations("womens");

  const { data: serviceTypes, isLoading: isLoadingTypes } =
    useGetServiceTypesQuery();

  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subCity, setSubCity] = useState("");
  const [woreda, setWoreda] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [beneficiaryLevel, setBeneficiaryLevel] = useState<
    "INDIVIDUAL" | "GROUP" | "ALL"
  >("ALL");
  const [format, setFormat] = useState<"EXCEL" | "PDF">("EXCEL");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((col) => col.id),
  );

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  };

  const handleGenerate = () => {
    const payload: GenerateWomenReportPayload = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      subCity: subCity || undefined,
      woreda: woreda || undefined,
      serviceTypeId:
        serviceTypeId && serviceTypeId !== "none"
          ? parseInt(serviceTypeId)
          : undefined,
      beneficiaryLevel:
        beneficiaryLevel === "ALL" ? undefined : beneficiaryLevel,
      selectedColumns,
      format,
    };

    generateReport(payload, {
      onSuccess: () => {
        toast.success(t("report.messages.success"));
        setOpen(false);
      },
      onError: (error: any) => {
        console.error(error);
        toast.error(error?.message || t("report.messages.error"));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          {t("dashboard.generateReport")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("report.title")}</DialogTitle>
          <DialogDescription>{t("report.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("report.startDate")}</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("report.endDate")}</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("report.subCity")}</Label>
              <Input
                placeholder={t("report.subCity")}
                value={subCity}
                onChange={(e) => setSubCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("report.woreda")}</Label>
              <Input
                placeholder={t("report.woreda")}
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
              />
            </div>
          </div>

          {/* Service Type and Beneficiary Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("report.serviceTypeId")}</Label>
              <Select value={serviceTypeId} onValueChange={setServiceTypeId}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingTypes
                        ? t("common.loading")
                        : t("report.selectServiceType")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("report.beneficiaryLevel")}</Label>
              <Select
                value={beneficiaryLevel}
                onValueChange={(v) =>
                  setBeneficiaryLevel(v as "INDIVIDUAL" | "GROUP" | "ALL")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("report.allLevels")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("report.allLevels")}</SelectItem>
                  <SelectItem value="INDIVIDUAL">
                    {t("report.individual")}
                  </SelectItem>
                  <SelectItem value="GROUP">{t("report.group")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label>{t("report.format")}</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as "EXCEL" | "PDF")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCEL">Excel</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Columns Selection */}
          <div className="space-y-2">
            <Label>{t("report.columns")}</Label>
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
            {t("form.buttons.cancel")}
          </Button>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("report.buttons.download")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
