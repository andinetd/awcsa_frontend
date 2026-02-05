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

import { useTranslations } from "next-intl";

export const Columns = () => {
  const t = useTranslations("care-centers-portal.dashboard.columns");
  const te = useTranslations("care-centers-portal.enums");

  const columns: ColumnDef<CareCenterChild>[] = [
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
    },
    {
      accessorKey: "middleName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("middleName")} />
      ),
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("gender")} />
      ),
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string;
        return (
          <Badge variant="outline">
            {gender ? te(`sex.${gender}`) : "N/A"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dob",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("dob")} />
      ),
      cell: ({ row }) => {
        const dob = row.getValue("dob") as string | null;
        return (
          <span>{dob ? format(new Date(dob), "MMM d, yyyy") : "N/A"}</span>
        );
      },
    },
    {
      accessorKey: "foundDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("foundDate")} />
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
                <span className="sr-only">{t("openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/care-centers-portal/child/${child.id}/view`}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t("viewDetails")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/care-centers-portal/child/${child.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("editChild")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
