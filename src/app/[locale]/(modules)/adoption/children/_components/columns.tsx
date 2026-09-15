"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  HeartHandshake,
  RotateCcw,
  User,
  Users,
} from "lucide-react";
import { Child, ChildStatus } from "@/types/child-matching-types";
import { uiTokens } from "@/styles/design-system";
import { cn } from "@/lib/utils";

const STATUS_BADGE_CONFIG: Record<
  string,
  { label: string; statusType: "primary" | "navy" | "neutral" | "subtle" | "warning" | "danger" | "success" | "info"; icon: React.ElementType }
> = {
  FOUND: {
    label: "Found",
    statusType: "warning",
    icon: Clock,
  },
  IN_CARE: {
    label: "In Care",
    statusType: "primary",
    icon: Building2,
  },
  IN_ADERA: {
    label: "In Adera",
    statusType: "neutral",
    icon: HeartHandshake,
  },
  WITH_BLOOD_RELATIVE: {
    label: "With Relative",
    statusType: "subtle",
    icon: Users,
  },
  ADOPTED: {
    label: "Adopted",
    statusType: "navy",
    icon: CheckCircle2,
  },
  RETURNED: {
    label: "Returned",
    statusType: "danger",
    icon: RotateCcw,
  },
};

export const getColumns = (
  t: any,
  onTransferStatus?: (child: Child) => void
): ColumnDef<Child>[] => [
  {
    id: "child",
    accessorFn: (row) =>
      `${row.serviceData?.formData?.firstName || row.serviceData?.client?.firstName || ""} ${
        row.serviceData?.formData?.lastName || row.serviceData?.client?.lastName || ""
      }`,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.name") || "Child Name"}
      />
    ),
    cell: ({ row }) => {
      const child = row.original;
      const firstName =
        child.serviceData?.formData?.firstName ||
        child.serviceData?.client?.firstName ||
        "—";
      const lastName =
        child.serviceData?.formData?.lastName ||
        child.serviceData?.client?.lastName ||
        "";
      const fullName = `${firstName} ${lastName}`.trim();

      return (
        <div className="flex flex-col gap-0.5">
          <Link
            href={`/adoption/children/${child.id}`}
            className="font-semibold text-slate-900 hover:text-[#1769AA] transition-colors"
          >
            {fullName}
          </Link>
          {child.childIdFromFacility && (
            <span className="font-mono text-[10.5px] font-semibold text-[#1769AA] bg-[#E8F2FA] px-1.5 py-0.2 rounded-xs border border-[#BCD5EA] w-fit">
              {child.childIdFromFacility}
            </span>
          )}
        </div>
      );
    },
    meta: {
      title: t("children.columns.name") || "Child Name",
    },
  },
  {
    id: "ageGender",
    accessorFn: (row) => {
      const dob =
        row.serviceData?.formData?.dateOfBirth ||
        row.serviceData?.client?.dateOfBirth;
      const sex =
        row.serviceData?.formData?.sex ||
        row.serviceData?.client?.contactInfo?.sex ||
        "";
      return `${dob || ""} ${sex}`;
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.age") || "Age & Sex"}
      />
    ),
    cell: ({ row }) => {
      const child = row.original;
      const dob =
        child.serviceData?.formData?.dateOfBirth ||
        child.serviceData?.client?.dateOfBirth;
      const age = dob
        ? `${new Date().getFullYear() - new Date(dob).getFullYear()} yrs`
        : "—";
      const sex = (
        child.serviceData?.formData?.sex ||
        child.serviceData?.client?.contactInfo?.sex ||
        "—"
      ).toUpperCase();

      return (
        <div className="text-xs">
          <span className="font-semibold text-slate-800">{age}</span>
          <span className="text-slate-400 mx-1">•</span>
          <span className="text-slate-600">{sex}</span>
        </div>
      );
    },
    meta: {
      title: t("children.columns.age") || "Age & Sex",
    },
  },
  {
    id: "facility",
    accessorFn: (row) =>
      row.childCareFacility?.name ||
      (row.custodian
        ? `${row.custodian.firstName} ${row.custodian.lastName}`
        : "Unassigned"),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.placement") || "Placement / Center"}
      />
    ),
    cell: ({ row }) => {
      const child = row.original;
      if (child.childCareFacility?.name) {
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate max-w-[180px]">
              {child.childCareFacility.name}
            </span>
          </div>
        );
      }
      if (child.custodian) {
        return (
          <div className="flex items-center gap-1.5 text-xs text-purple-700">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[180px]">
              {child.custodian.firstName} {child.custodian.lastName}
            </span>
          </div>
        );
      }
      return <span className="text-xs text-slate-400 italic">Unassigned</span>;
    },
    meta: {
      title: t("children.columns.placement") || "Placement / Center",
    },
  },
  {
    id: "placeFound",
    accessorFn: (row) => row.placeWhereChildFound,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.placeFound") || "Intake Location"}
      />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 truncate max-w-[160px] block">
        {row.original.placeWhereChildFound || "—"}
      </span>
    ),
    meta: {
      title: t("children.columns.placeFound") || "Intake Location",
    },
  },
  {
    accessorKey: "currentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("children.columns.status") || "Status"}
      />
    ),
    cell: ({ row }) => {
      const status = (row.original.currentStatus as string) || "FOUND";
      const cfg = STATUS_BADGE_CONFIG[status] || {
        label: status,
        statusType: "neutral" as const,
        icon: Clock,
      };
      const Icon = cfg.icon;
      return (
        <span
          className={cn(
            uiTokens.statusTag.base,
            uiTokens.statusTag[cfg.statusType],
            "gap-1"
          )}
        >
          <Icon className="size-3" />
          <span>{cfg.label}</span>
        </span>
      );
    },
    meta: {
      title: t("children.columns.status") || "Status",
    },
  },
  {
    id: "actions",
    header: () => <span className="text-xs font-semibold text-slate-700">Actions</span>,
    cell: ({ row }) => {
      const child = row.original;
      return (
        <div className="flex items-center gap-1.5">
          <Link href={`/adoption/children/${child.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-6.5 px-2 text-xs text-slate-700 border-[#E3E7EB] hover:bg-slate-50 hover:text-[#1769AA] rounded-xs cursor-pointer shadow-none"
            >
              <Eye className="size-3 mr-1 text-slate-500" />
              {t("children.actions.view") || "View"}
            </Button>
          </Link>
          {onTransferStatus && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6.5 px-2 text-xs text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-xs cursor-pointer"
              onClick={() => onTransferStatus(child)}
              title="Transfer child status"
            >
              <ArrowRightLeft className="size-3 mr-1 text-slate-500" />
              {t("children.actions.transfer") || "Transfer"}
            </Button>
          )}
        </div>
      );
    },
  },
];
