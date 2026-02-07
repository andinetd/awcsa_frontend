import React from "react";
import BeneficiaryReportDialog from "../_components/report-dialog";
import { useTranslations } from "next-intl";

const ElderlyAndDisabled = () => {
  const t = useTranslations("social-affairs.elderlyAndDisabled.dashboard");
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            {t("title")}
          </h1>
          <p className="text-slate-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <BeneficiaryReportDialog />
        </div>
      </div>

      {/* Stats or other dashboard content can go here */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder for future dashboard cards */}
      </div>
    </div>
  );
};

export default ElderlyAndDisabled;
