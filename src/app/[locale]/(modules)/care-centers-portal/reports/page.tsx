"use client";

import React, { useState } from "react";
import { useCareCenterReports } from "@/hooks/adoption/care-center/useReports";
import { Loader2, FileText, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Columns } from "./columns";
import { ReportDetailsDialog } from "./_components/report-details-dialog";
import { MonthlyReport } from "@/api/adoption/care-center/reports";

export default function ReportsPage() {
  const t = useTranslations("care-centers-portal.reports");
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectReport = (report: MonthlyReport) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const columns = Columns({ onSelectReport: handleSelectReport });
  const { data: reports, isLoading, isError } = useCareCenterReports();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh] text-destructive gap-2">
        <p>{t("messages.error")}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t("buttons.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Monthly Activity Reports</h2>
          <p className="text-xs text-muted-foreground">
            Track and review your center's submitted monthly operations and intake censuses.
          </p>
        </div>
        <Link href="/care-centers-portal/monthly-report">
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            <span>Submit New Report</span>
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-2">
        <DataTable columns={columns} data={reports || []} />
      </div>

      <ReportDetailsDialog
        report={selectedReport}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}

