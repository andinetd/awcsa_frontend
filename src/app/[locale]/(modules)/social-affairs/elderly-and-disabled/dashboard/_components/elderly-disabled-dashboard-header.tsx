"use client";

import React from "react";
import Link from "next/link";
import {
  RefreshCw,
  Printer,
  Plus,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import BeneficiaryReportDialog from "../../_components/report-dialog";

interface ElderlyDisabledDashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ElderlyDisabledDashboardHeader({
  onRefresh,
  isRefreshing = false,
}: ElderlyDisabledDashboardHeaderProps) {
  const t = useTranslations("social-affairs.elderlyAndDisabled.dashboard");

  return (
    <div className="space-y-3">
      {/* Institutional Hierarchy & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E7EB] pb-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500 font-mono">
          <span className="flex size-2 rounded-full bg-[#1769AA]" />
          <span>{t("header.cityAdmin")}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">{t("header.bureau")}</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#1769AA]">{t("header.directorate")}</span>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer rounded-xs"
          >
            <RefreshCw
              className={`mr-1.5 size-3.5 ${
                isRefreshing ? "animate-spin text-[#1769AA]" : "text-slate-500"
              }`}
            />
            {t("header.refresh")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer rounded-xs"
          >
            <Printer className="mr-1.5 size-3.5 text-slate-500" />
            {t("header.print")}
          </Button>
          <Link href="/social-affairs/elderly-and-disabled/search">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 border-[#E3E7EB] bg-white cursor-pointer rounded-xs"
            >
              <Search className="mr-1.5 size-3.5 text-slate-500" />
              {t("header.search")}
            </Button>
          </Link>
          <BeneficiaryReportDialog />
          <Link href="/social-affairs/elderly-and-disabled/beneficiaries">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-[#0B1F3A] hover:bg-[#122D52] text-white font-medium shadow-2xs cursor-pointer rounded-xs"
            >
              <Plus className="mr-1.5 size-3.5 text-[#38BDF8]" />
              {t("header.registerBeneficiary")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Title & Executive Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              {t("title")}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA]">
              {t("header.badge")}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[11px] font-mono text-slate-400 block">
            {t("header.safetyNetRegister")}
          </span>
          <span className="text-xs font-mono font-medium text-slate-600">
            {t("header.faydaIntegrated")}
          </span>
        </div>
      </div>
    </div>
  );
}
