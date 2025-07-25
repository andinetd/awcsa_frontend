import { createColumnHelper } from "@tanstack/react-table";
import UserActionsMenu from "./UserActionsMenu";
import { KeyRound, Pencil, Trash } from "lucide-react";

export type UserData = {
  name: string;
  email: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
};

const columnHelper = createColumnHelper<UserData>();

export function getUserColumns({
  onEdit,
  onChangePermission,
  onDelete,
}: {
  onEdit: (user: UserData) => void;
  onChangePermission: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}) {
  return [
    columnHelper.accessor("name", {
      header: "User name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    }),
    columnHelper.accessor("access", {
      header: "Access",
      meta: { hideOnMobile: true },
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.access.map((role) => (
            <span
              key={role}
              className={`text-xs px-2 py-1 rounded-full ${
                role === "Admin"
                  ? "bg-green-100 text-green-800"
                  : role === "Data Export"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("lastActive", {
      header: "Last active",
      meta: { hideOnMobile: true },
    }),
    columnHelper.accessor("dateAdded", {
      header: "Date added",
      meta: { hideOnMobile: true },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <UserActionsMenu
          onEdit={() => onEdit(row.original)}
          onChangePermission={() => onChangePermission(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
    }),
  ];
}
