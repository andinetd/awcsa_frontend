"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Printer } from "lucide-react";
import { toast } from "sonner";
import { EdirCouncil } from "@/api/social-affairs/edir";
import { printCouncilDossier } from "@/lib/pdf/print-council-dossier";

interface CouncilReportMenuProps {
  council: EdirCouncil;
}

export default function CouncilReportMenu({ council }: CouncilReportMenuProps) {
  const t = useTranslations("social-affairs.edir.councils");
  const locale = useLocale();
  const currentLang: "en" | "am" = locale === "am" ? "am" : "en";
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = (e: React.MouseEvent, lang: "en" | "am" = currentLang) => {
    e.stopPropagation();
    setIsPrinting(true);
    try {
      printCouncilDossier(council, lang);
      toast.success(t("messages.printSuccess"));
    } catch (err: any) {
      toast.error(err?.message || "Failed to print council roster");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5"
          disabled={isPrinting}
        >
          <ChevronDown className="w-3.5 h-3.5" />
          <span>{t("buttons.report")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-xs border-[#E3E7EB] bg-white shadow-lg text-xs"
      >
        <DropdownMenuLabel className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
          {t("buttons.reportLabel")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#E3E7EB]" />
        <DropdownMenuItem
          className="cursor-pointer text-xs flex items-center gap-2 py-1.5 focus:bg-slate-50"
          onSelect={(e) => {
            e.preventDefault();
            handlePrint(e as any, "am");
          }}
        >
          <Printer className="w-4 h-4 text-[#1769AA]" />
          <span>{locale === "am" ? "የምክር ቤት ቻርተር (አማርኛ) አትም" : "Print Charter (Amharic)"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs flex items-center gap-2 py-1.5 focus:bg-slate-50"
          onSelect={(e) => {
            e.preventDefault();
            handlePrint(e as any, "en");
          }}
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>{locale === "am" ? "የምክር ቤት ቻርተር (እንግሊዝኛ) አትም" : "Print Charter (English)"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
