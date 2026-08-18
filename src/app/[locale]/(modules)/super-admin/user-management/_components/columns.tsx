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
        <div className="flex flex-col">
          <span className="font-medium">{`${firstName} ${lastName}`}</span>
          <span className="text-xs text-muted-foreground">
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
      return <Badge variant="outline">{role.replace(/_/g, " ")}</Badge>;
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
        <div className="flex flex-col">
          <span className="truncate max-w-[200px]" title={org}>
            {org}
          </span>
          {type && (
            <span className="text-xs text-muted-foreground">{type}</span>
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
          variant={
            status === "ACTIVE"
              ? "default"
              : status === "LOCKED" || status === "INACTIVE"
                ? "destructive"
                : "secondary"
          }
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
