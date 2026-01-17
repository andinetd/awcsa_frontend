"use client";

import { CareCenterChild } from "@/api/adoption/care-center/children";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
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
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<CareCenterChild>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "middleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Middle Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return <Badge variant="outline">{gender}</Badge>;
    },
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => {
      const dob = row.getValue("dob") as string | null;
      return <span>{dob ? format(new Date(dob), "MMM d, yyyy") : "N/A"}</span>;
    },
  },
  {
    accessorKey: "foundDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Found Date" />
    ),
    cell: ({ row }) => {
      const foundDate = row.getValue("foundDate") as string | null;
      return (
        <span>
          {foundDate ? format(new Date(foundDate), "MMM d, yyyy") : "N/A"}
        </span>
      );
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
              <Link href={`/care-centers-portal/child/${child.id}/view`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/care-centers-portal/child/${child.id}/edit`}>
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
