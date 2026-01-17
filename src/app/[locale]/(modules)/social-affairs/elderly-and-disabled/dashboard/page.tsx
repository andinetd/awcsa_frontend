import React from "react";
import BeneficiaryReportDialog from "../_components/report-dialog";

const ElderlyAndDisabled = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            Elderly and Disabled Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of registry, training, and job placement activities.
          </p>
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
  