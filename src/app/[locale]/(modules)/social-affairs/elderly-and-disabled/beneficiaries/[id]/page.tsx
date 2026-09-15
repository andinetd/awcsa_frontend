"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import CaseHistoryView from "../../_components/case-history-view";
import CrossDepartmentHistory from "@/components/shared/cross-department-history";

export default function BeneficiaryProfilePage() {
  const t = useTranslations("social-affairs.elderlyAndDisabled.profile");
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  if (Number.isNaN(id)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500">{t("notFound")}</p>
        <Button
          variant="outline"
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB]"
          onClick={() => router.back()}
        >
          {t("goBack")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-[#1769AA] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/social-affairs/elderly-and-disabled/dashboard" className="hover:text-[#1769AA] transition-colors">
          Disability & Elderly
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/social-affairs/elderly-and-disabled/beneficiaries" className="hover:text-[#1769AA] transition-colors">
          Beneficiaries
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">Case #{id}</span>
      </div>

      {/* Back Button Bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs border-[#E3E7EB] hover:bg-slate-50 gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
          <span>{t("goBack")}</span>
        </Button>
      </div>

      {/* Case History Core View */}
      <CaseHistoryView clientId={id} />

      {/* Cross-department panel — shows support from Women, Edir, etc. */}
      <div>
        <CrossDepartmentHistory clientId={id} />
      </div>
    </div>
  );
}
