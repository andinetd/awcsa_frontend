"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Printer, FileDown, Loader2 } from "lucide-react";
import { printBeneficiaryDossier } from "@/lib/pdf/print-beneficiary-dossier";

interface BeneficiaryReportMenuProps {
  beneficiary: any;
}

export function BeneficiaryReportMenu({ beneficiary }: BeneficiaryReportMenuProps) {
  const [loading, setLoading] = useState(false);
  const locale = useLocale() === "en" ? "en" : "am";

  const handlePrint = (lang: "en" | "am" = "am") => {
    setLoading(true);
    try {
      printBeneficiaryDossier(beneficiary, lang);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50 gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1769AA]" />
          ) : (
            <FileDown className="w-3.5 h-3.5 text-[#1769AA]" />
          )}
          <span>{locale === "am" ? "ሪፖርት እና ዶሲዬ" : "Reports & Dossier"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xs border-[#E3E7EB] shadow-md font-mono text-xs">
        <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          {locale === "am" ? "የህትመት ተግባራት" : "Beneficiary Print Actions"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#E3E7EB]" />
        <DropdownMenuItem
          onClick={() => handlePrint("am")}
          className="cursor-pointer gap-2 focus:bg-[#E8F2FA] focus:text-[#1769AA]"
        >
          <Printer className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>ዋናውን ዶሲዬ አትም (አማርኛ)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handlePrint("en")}
          className="cursor-pointer gap-2 focus:bg-[#E8F2FA] focus:text-[#1769AA]"
        >
          <Printer className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>Print Official Dossier (English)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
