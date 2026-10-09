"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Home } from "lucide-react";

const AssistedHomes = () => {
  const t = useTranslations("adoption");

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="bg-white border border-[#E3E7EB] p-4 sm:p-5 rounded-xs shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>{t("careCenters.headerAdmin1")}</span>
          <span>·</span>
          <span>{t("careCenters.headerAdmin2")}</span>
          <span>·</span>
          <span className="text-[#1769AA] font-semibold">
            {t("careCenters.headerAdmin3")}
          </span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#0B1F3A]">
          {t("assistedHomes.title")}
        </h1>
        <p className="text-xs text-slate-500">
          {t("assistedHomes.subtitle")}
        </p>
      </div>

      <div className="bg-white border border-[#E3E7EB] rounded-xs shadow-2xs p-12 text-center space-y-3">
        <div className="size-12 rounded-full bg-[#E8F2FA] text-[#1769AA] mx-auto flex items-center justify-center">
          <Home className="size-6" />
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {t("assistedHomes.empty")}
        </p>
      </div>
    </div>
  );
};

export default AssistedHomes;
