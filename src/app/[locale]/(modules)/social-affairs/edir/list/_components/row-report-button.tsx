"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Printer,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Edir } from "@/api/social-affairs/edir";
import { printEdirDossier } from "@/lib/pdf/print-edir-dossier";
import { useGenerateEdirReportMutation } from "@/hooks/social-affairs";

interface EdirRowReportButtonProps {
  edir: Edir;
}

/**
 * Compact per-edir report trigger for the list page. Matches the
 * exact structure and UX of RowReportButton in the Women module.
 */
export default function EdirRowReportButton({ edir }: EdirRowReportButtonProps) {
  const t = useTranslations("social-affairs.edir.edir.report");
  const { mutate: generateReport, isPending } = useGenerateEdirReportMutation();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPrinting(true);
    try {
      printEdirDossier(edir);
      toast.success(t("messages.pdf"));
    } catch (err: any) {
      toast.error(err?.message || t("error"));
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExport = (e: React.MouseEvent, format: "EXCEL" | "PDF") => {
    e.stopPropagation();
    if (format === "PDF") {
      printEdirDossier(edir);
      toast.success(t("messages.pdf"));
      return;
    }

    generateReport(
      {
        format: "EXCEL",
        selectedColumns: [
          "name",
          "id",
          "phoneNumber",
          "subCity",
          "woreda",
          "bankAccountNumber",
          "establishmentDate",
          "members",
        ],
        subCity: edir.subCity,
        woreda: edir.woreda,
      },
      {
        onSuccess: (data) => {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const sanitized = (edir.name || "edir").replace(/[^a-zA-Z0-9_-]/g, "_");
          link.setAttribute("download", `${sanitized}_report.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
          toast.success(t("messages.excel"));
        },
        onError: (err: any) => {
          toast.error(err?.message || t("error"));
        },
      }
    );
  };

  const pending = isPending || isPrinting;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          disabled={pending}
          className="h-7 w-7 text-slate-500 hover:text-[#1769AA] hover:bg-[#E8F2FA] rounded-xs cursor-pointer"
          title={t("buttons.generate")}
        >
          {pending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xs border-[#E3E7EB] bg-white shadow-lg text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuLabel className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
          {t("menuLabel")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#E3E7EB]" />
        <DropdownMenuItem
          className="cursor-pointer text-xs flex items-center gap-2 py-1.5 focus:bg-slate-50"
          onSelect={(e) => {
            e.preventDefault();
            handlePrint(e as any);
          }}
        >
          <Printer className="w-4 h-4 text-[#1769AA]" />
          <span>{t("printDossier")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs flex items-center gap-2 py-1.5 focus:bg-slate-50"
          onSelect={(e) => {
            e.preventDefault();
            handleExport(e as any, "PDF");
          }}
        >
          <FileText className="w-4 h-4 text-[#1769AA]" />
          <span>{t("formats.pdf")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs flex items-center gap-2 py-1.5 focus:bg-slate-50"
          onSelect={(e) => {
            e.preventDefault();
            handleExport(e as any, "EXCEL");
          }}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>{t("formats.excel")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
