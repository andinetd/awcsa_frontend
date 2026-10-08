"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function WomenInstitutionalBanner() {
  const t = useTranslations("women");
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
      <span>{t("institutionalBanner.cityAdmin")}</span>
      <span>·</span>
      <span>{t("institutionalBanner.bureau")}</span>
      <span>·</span>
      <span className="text-[#1769AA] font-semibold">
        {t("institutionalBanner.sector")}
      </span>
    </div>
  );
}

export default WomenInstitutionalBanner;
