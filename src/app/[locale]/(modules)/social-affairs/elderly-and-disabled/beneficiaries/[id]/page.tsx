"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
        <p className="text-slate-500">{t("notFound")}</p>
        <Button onClick={() => router.back()}>{t("goBack")}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="p-6 pb-0 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm text-slate-500">{t("goBack")}</span>
      </div>
      <CaseHistoryView clientId={id} />

      {/* Cross-department panel — shows support from Women, Edir, etc. */}
      <div className="px-6 pb-6">
        <CrossDepartmentHistory clientId={id} />
      </div>
    </div>
  );
}
