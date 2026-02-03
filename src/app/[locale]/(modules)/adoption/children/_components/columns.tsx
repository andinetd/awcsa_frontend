"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { Child } from "@/types/child-matching-types";

export const getColumns = (t: any): ColumnDef<Child>[] => [
  {
    id: "name",
    accessorFn: (row) =>
      `${row.serviceData.formData.firstName} ${row.serviceData.formData.lastName}`,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.name")}
      />
    ),
    meta: {
      title: t("children.columns.name"),
    },
  },
  {
    id: "age",
    accessorFn: (row) => {
      const dob = row.serviceData.formData.dateOfBirth;
      if (!dob) return "N/A";
      return (
        new Date().getFullYear() - new Date(dob).getFullYear()
      ).toString();
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.age")}
      />
    ),
    meta: {
      title: t("children.columns.age"),
    },
  },
  {
    id: "gender",
    accessorFn: (row) => row.serviceData.formData.sex,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.gender")}
      />
    ),
    meta: {
      title: t("children.columns.gender"),
    },
  },
  {
    id: "placeFound",
    accessorFn: (row) => row.placeWhereChildFound,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.placeFound")}
      />
    ),
    meta: {
      title: t("children.columns.placeFound"),
    },
  },
  {
    accessorKey: "currentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.status")}
      />
    ),
    meta: {
      title: t("children.columns.status"),
    },
  },
];
