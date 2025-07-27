"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { NewCareCenterSchemaType } from "@/schemas/care-centers";

export const careCenterColumns: ColumnDef<NewCareCenterSchemaType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Care Center Name" />
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
  },
  {
    accessorKey: "minAge",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Minimum Age" />
    ),
  },
  {
    accessorKey: "maxAge",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Maximum Age" />
    ),
  },
];
