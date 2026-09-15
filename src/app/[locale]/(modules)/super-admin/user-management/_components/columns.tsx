"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/super-admin";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"; // Assuming this exists or using standard
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./user-actions";

interface ColumnsProps {
  onUserUpdated: () => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onChangePermissions: (user: User) => void;
  t: (key: string) => string;
}

export const getColumns = ({
  onUserUpdated,
  onEdit,
  onChangeRole,
  onChangePermissions,
  t,
}: ColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "employee.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("name")} />
    ),
    cell: ({ row }) => {
      const firstName = row.original.employee?.firstName || "";
      const lastName = row.original.employee?.lastName || "";
      return (
        <div className="flex flex-col py-0.5">
          <span className="font-semibold text-xs text-[#0B1F3A]">{`${firstName} ${lastName}`}</span>
          <span className="text-[11px] font-mono text-slate-500">
            {row.original.email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "employee.role.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("role")} />
    ),
    cell: ({ row }) => {
      const role = row.original.employee?.role?.name || t("na");
      return (
        <Badge
          variant="outline"
          className="rounded-xs font-mono text-[11px] font-medium border border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA]"
        >
          {role.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "employee.orgUnit.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("organization")} />
    ),
    cell: ({ row }) => {
      const org = row.original.employee?.orgUnit?.name || t("na");
      const type = row.original.employee?.orgUnit?.type || "";
      return (
        <div className="flex flex-col py-0.5">
          <span className="truncate max-w-[200px] text-xs font-medium text-slate-700" title={org}>
            {org}
          </span>
          {type && (
            <span className="text-[11px] font-mono text-slate-400">{type}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("status")} />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className={`rounded-xs font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 ${
            status === "ACTIVE"
              ? "border-[#BCD5EA] bg-[#E8F2FA] text-[#1769AA]"
              : status === "LOCKED" || status === "INACTIVE"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-[#E3E7EB] bg-slate-100 text-slate-700"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <UserActions
        user={row.original}
        onUserUpdated={onUserUpdated}
        onEdit={onEdit}
        onChangeRole={onChangeRole}
        onChangePermissions={onChangePermissions}
      />
    ),
  },
];
