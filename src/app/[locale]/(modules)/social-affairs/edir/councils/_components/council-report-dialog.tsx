"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EdirCouncil, EdirLevel, EdirStatus } from "@/api/social-affairs/edir";
import { useTranslations } from "next-intl";

interface CouncilReportDialogProps {
  councils: EdirCouncil[];
}

export default function CouncilReportDialog({ councils }: CouncilReportDialogProps) {
  const t = useTranslations("social-affairs.edir.councils");
  const [open, setOpen] = useState(false);
  const [levelFilter, setLevelFilter] = useState<EdirLevel | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<EdirStatus | "ALL">("ALL");

  const handlePrintReport = () => {
    const filtered = councils.filter((c) => {
      const matchLevel = levelFilter === "ALL" || c.level === levelFilter;
      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchLevel && matchStatus;
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = filtered
      .map(
        (c, idx) => `
        <tr>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-weight: 700; font-size: 12px;">${c.name}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${c.registrationNumber || "—"}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px;">${c.level}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px;">${c.subCity} ${c.woreda ? `· Woreda ${c.woreda}` : ""}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 12px; font-weight: 600;">${c.chairpersonName || "—"}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 11px;">${c.chairpersonPhone || "—"}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-family: monospace; font-weight: 700; text-align: center;">${c._count?.memberEdirs ?? c.memberEdirs?.length ?? 0}</td>
          <td style="padding: 6px 10px; border: 1px solid #CBD5E1; font-size: 11px; font-weight: 700;">${c.status}</td>
        </tr>
      `
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Edir Councils Master Registry Report</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 16px;
      line-height: 1.4;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0B1F3A;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .inst-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #1769AA;
      text-transform: uppercase;
    }
    .doc-title {
      font-size: 16px;
      font-weight: 800;
      color: #0B1F3A;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .meta {
      font-size: 11px;
      color: #64748B;
      margin-top: 4px;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th {
      background: #F1F5F9;
      padding: 6px 8px;
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 700;
      color: #475569;
      border: 1px solid #CBD5E1;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 12px; text-align: right;">
    <button onclick="window.print()" style="padding: 6px 14px; background: #1769AA; color: #fff; border: none; font-weight: 600; border-radius: 2px; cursor: pointer;">
      Print Roster Report (Ctrl + P)
    </button>
  </div>

  <div class="header">
    <div class="inst-title">Addis Ababa City Administration · Bureau of Women &amp; Social Affairs</div>
    <div class="doc-title">Traditional Edir Councils Master Directory Report</div>
    <div class="meta">Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · Total Records: ${filtered.length}</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px;">#</th>
        <th>Council Name</th>
        <th>Reg #</th>
        <th>Level</th>
        <th>Sub-City / Woreda</th>
        <th>Chairperson</th>
        <th>Contact Phone</th>
        <th style="text-align: center;">Members</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5"
        >
          <FileDown className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>{t("buttons.report")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            <FileDown className="w-4 h-4 text-[#1769AA]" />
            <span>{t("buttons.generateReport")}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {t("buttons.reportDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">{t("level.title")}</Label>
            <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as any)}>
              <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB]">
                <SelectItem value="ALL" className="text-xs">All Levels</SelectItem>
                <SelectItem value="WOREDA" className="text-xs">Woreda Level</SelectItem>
                <SelectItem value="SUB_CITY" className="text-xs">Sub-City Level</SelectItem>
                <SelectItem value="CITY" className="text-xs">City Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">{t("status.title")}</Label>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="h-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xs border-[#E3E7EB]">
                <SelectItem value="ALL" className="text-xs">All Statuses</SelectItem>
                <SelectItem value="ACTIVE" className="text-xs">Active</SelectItem>
                <SelectItem value="EXPIRED" className="text-xs">Expired</SelectItem>
                <SelectItem value="REVOKED" className="text-xs">Revoked</SelectItem>
                <SelectItem value="CANCELLED" className="text-xs">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB]">
          <Button
            variant="outline"
            className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
            onClick={() => setOpen(false)}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            onClick={handlePrintReport}
            className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t("buttons.printRoster")}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
