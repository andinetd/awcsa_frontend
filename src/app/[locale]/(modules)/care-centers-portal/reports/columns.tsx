"use client";

import { MonthlyReport } from "@/api/adoption/care-center/reports";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return format(date, "MMMM");
};

export const columns: ColumnDef<MonthlyReport>[] = [
  {
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
    cell: ({ row }) => {
      const month = row.getValue("month") as number;
      return <span className="font-medium">{getMonthName(month)}</span>;
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    accessorKey: "totalChildren",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Children" />
    ),
  },
  {
    accessorKey: "newAdmissions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="New Admissions" />
    ),
  },
  {
    accessorKey: "discharges",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discharges" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
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
