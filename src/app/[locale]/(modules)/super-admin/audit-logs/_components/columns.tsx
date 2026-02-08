"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "@/types/super-admin";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const email = row.original.user?.email || "Unknown";
      const firstName = row.original.user?.employee?.firstName || "";
      const lastName = row.original.user?.employee?.lastName || "";
      return (
        <div className="flex flex-col">
          <span className="font-medium">{`${firstName} ${lastName}`}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const action = row.original.action;
      return (
        <Badge
          variant={
            action === "CREATE"
              ? "default"
              : action === "DELETE"
                ? "destructive"
                : "outline"
          }
        >
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "entityType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entity" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.createdAt), "MMM d, yyyy HH:mm:ss");
      } catch (e) {
        return row.original.createdAt;
      }
    },
  },
  {
    accessorKey: "remark",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => (
      <span className="text-sm truncate max-w-[300px]">
        {row.original.remark}
      </span>
    ),
  },
];
