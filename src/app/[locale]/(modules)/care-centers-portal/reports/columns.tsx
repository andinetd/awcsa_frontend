"use client";

import { MonthlyReport } from "@/api/adoption/care-center/reports";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

export const Columns = () => {
  const t = useTranslations("care-centers-portal.monthlyReport");
  const tc = useTranslations("care-centers-portal.dashboard.columns");

  const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    // Use the localized month name if possible, or keep it as is for now
    // Since we are in a hook, we could potentially use next-intl's formatter
    return format(date, "MMMM");
  };

  const columns: ColumnDef<MonthlyReport>[] = [
    {
      accessorKey: "month",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("month")} />
      ),
      cell: ({ row }) => {
        const month = row.getValue("month") as number;
        return <span className="font-medium">{getMonthName(month)}</span>;
      },
    },
    {
      accessorKey: "year",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("year")} />
      ),
    },
    {
      accessorKey: "totalChildren",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("totalChildren")} />
      ),
    },
    {
      accessorKey: "newAdmissions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("newAdmissions")} />
      ),
    },
    {
      accessorKey: "discharges",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("discharges")} />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tc("status")}
        /> // Using fallback if status is missing in JSON
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "APPROVED" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "submittedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Submitted On" />
      ),
      cell: ({ row }) => {
        const submittedAt = row.getValue("submittedAt") as string | null;
        return (
          <span>
            {submittedAt ? format(new Date(submittedAt), "MMM d, yyyy") : "N/A"}
          </span>
        );
      },
    },
  ];

  return columns;
};
