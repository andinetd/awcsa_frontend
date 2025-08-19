"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { ChildDataType } from "@/schemas/new-child-form-schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
export type Child = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<ChildDataType>[] = [
  {
    accessorKey: "name_by_care_center",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name by Center" />
    ),
  },
  {
    accessorKey: "name_by_family",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name by Family" />
    ),
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return <span className="capitalize">{gender}</span>;
    },
  },
  {
    accessorKey: "found_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Found Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("found_date") as Date;
      return <span>{date ? new Date(date).toLocaleDateString() : "N/A"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const child = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/care-centers-portal/child/${child.id}/view`}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/care-centers-portal/child/${child.id}/edit`}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Child
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
