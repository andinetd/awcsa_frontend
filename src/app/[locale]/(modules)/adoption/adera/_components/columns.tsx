"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { AderaTableType, NewAderaSchemaType } from "@/schemas/adera-schema";

export const getAderaColumns = (
  t: (key: string) => string
): ColumnDef<AderaTableType>[] => [
  {
    accessorKey: "cityIdNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.cityIdNumber")}
      />
    ),
  },
  {
    accessorKey: "educationLevel",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.educationLevel")}
      />
    ),
  },
  {
    accessorKey: "occupation",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.occupation")}
      />
    ),
  },
  {
    accessorKey: "monthlyIncome",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.monthlyIncome")}
      />
    ),
  },
  {
    accessorKey: "partnerCityIdNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.partnerCityIdNumber")}
      />
    ),
    cell: ({ row }) => row.original.partnerCityIdNumber ?? "N/A",
  },
  {
    accessorKey: "preferredChildGender",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.preferredChildGender")}
      />
    ),
  },
  {
    accessorKey: "preferredChildMinAge",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.preferredChildMinAge")}
      />
    ),
  },
  {
    accessorKey: "preferredChildMaxAge",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adera.columns.preferredChildMaxAge")}
      />
    ),
  },
];

export const columns: ColumnDef<AderaTableType>[] = [
  {
    accessorKey: "cityIdNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City ID" />
    ),
  },
  {
    accessorKey: "educationLevel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Education Level" />
    ),
  },
  {
    accessorKey: "occupation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Occupation" />
    ),
  },
  {
    accessorKey: "monthlyIncome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monthly Income" />
    ),
  },
  {
    accessorKey: "partnerCityIdNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partner City ID" />
    ),
    cell: ({ row }) => row.original.partnerCityIdNumber ?? "N/A",
  },
  {
    accessorKey: "preferredChildGender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preferred Gender" />
    ),
  },
  {
    accessorKey: "preferredChildMinAge",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preferred Min Age" />
    ),
  },
  {
    accessorKey: "preferredChildMaxAge",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preferred Max Age" />
    ),
  },
];
