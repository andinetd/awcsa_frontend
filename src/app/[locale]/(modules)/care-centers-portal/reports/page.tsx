"use client";

import { useCareCenterReports } from "@/hooks/adoption/care-center/useReports";
import { ArrowLeft, Loader2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
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
        <p>Failed to load reports. Please try again later.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
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
