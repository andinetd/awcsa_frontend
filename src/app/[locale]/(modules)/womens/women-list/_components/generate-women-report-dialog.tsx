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

const AVAILABLE_COLUMNS = [
  { id: "clientName", label: "Client Name" },
  { id: "cityIdNumber", label: "City ID Number" },
  { id: "phoneNumber", label: "Phone Number" },
  { id: "address", label: "Address" },
  { id: "serviceType", label: "Service Type" },
  { id: "beneficiaryLevel", label: "Beneficiary Level" },
  { id: "serviceDate", label: "Service Date" },
  { id: "status", label: "Status" },
];

export default function GenerateWomenReportDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: generateReport, isPending } =
    useGenerateWomenReportMutation();

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
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "clientName",
    "cityIdNumber",
    "phoneNumber",
    "address",
    "serviceType",
    "beneficiaryLevel",
    "serviceDate",
    "status",
  ]);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleGenerate = () => {
    const payload: GenerateWomenReportPayload = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      subCity: subCity || undefined,
      woreda: woreda || undefined,
      serviceTypeId: serviceTypeId ? parseInt(serviceTypeId) : undefined,
      beneficiaryLevel:
        beneficiaryLevel === "ALL" ? undefined : beneficiaryLevel,
      selectedColumns,
      format,
    };

    generateReport(payload, {
      onSuccess: () => {
        toast.success("Report generated and downloaded successfully");
        setOpen(false);
      },
      onError: (error: any) => {
        console.error(error);
        toast.error(error?.message || "Failed to generate report");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Women Support Services Report</DialogTitle>
          <DialogDescription>
            Select filters and columns for your report.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date Range */}
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

          {/* Location Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sub City</Label>
              <Input
                placeholder="Sub City"
                value={subCity}
                onChange={(e) => setSubCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Woreda</Label>
              <Input
                placeholder="Woreda"
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
              />
            </div>
          </div>

          {/* Service Type and Beneficiary Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Service Type ID</Label>
              <Input
                type="number"
                placeholder="Service Type ID"
                value={serviceTypeId}
                onChange={(e) => setServiceTypeId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Beneficiary Level</Label>
              <Select
                value={beneficiaryLevel}
                onValueChange={(v) =>
                  setBeneficiaryLevel(v as "INDIVIDUAL" | "GROUP" | "ALL")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                  <SelectItem value="GROUP">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label>Format</Label>
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
            <Label>Columns to Include</Label>
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
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
