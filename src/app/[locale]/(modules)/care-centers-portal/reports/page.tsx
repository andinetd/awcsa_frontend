"use client";

import { useCareCenterReports } from "@/hooks/adoption/care-center/useReports";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Columns } from "./columns";

export default function ReportsPage() {
  const t = useTranslations("care-centers-portal.reports");
  const columns = Columns();
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
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-2">
      <DataTable columns={columns} data={reports || []} />
    </div>
  );
}
