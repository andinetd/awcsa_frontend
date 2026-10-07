"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, Printer, FileDown, Loader2 } from "lucide-react";
import { Beneficiary as BeneficiaryV2 } from "@/api/beneficiaries/types-v2";
import { printBeneficiaryDossier } from "@/lib/pdf/print-beneficiary-dossier";

interface RowReportButtonProps {
  beneficiary: BeneficiaryV2 | any;
}

export function BeneficiaryRowReportButton({ beneficiary }: RowReportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePrintDossier = () => {
    setLoading(true);
    try {
      printBeneficiaryDossier(beneficiary);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 rounded-xs border-[#E3E7EB] hover:bg-[#E8F2FA] hover:text-[#1769AA] transition-colors"
          title="Print or Export Beneficiary Report"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1769AA]" />
          ) : (
            <Printer className="w-3.5 h-3.5 text-slate-600" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xs border-[#E3E7EB] shadow-md font-mono text-xs">
        <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          Beneficiary Dossier
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#E3E7EB]" />
        <DropdownMenuItem
          onClick={handlePrintDossier}
          className="cursor-pointer gap-2 focus:bg-[#E8F2FA] focus:text-[#1769AA]"
        >
          <Printer className="w-3.5 h-3.5 text-[#1769AA]" />
          <span>Print Official Dossier</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
