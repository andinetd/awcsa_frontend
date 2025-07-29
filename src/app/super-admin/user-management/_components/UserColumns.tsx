import { createColumnHelper } from "@tanstack/react-table";
import UserActionsMenu from "./UserActionsMenu";
import { formatRole } from "@/lib/utils";
import type { RegisterEmployeeDto } from "@/types/employee";


const columnHelper = createColumnHelper<RegisterEmployeeDto>();

export function getUserColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (user: RegisterEmployeeDto) => void;
  onDelete: (user: RegisterEmployeeDto) => void;
}) {
  return [
    columnHelper.accessor("firstName", {
      header: "First Name",
      cell: ({ row }) => row.original.firstName,
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
      cell: ({ row }) => row.original.lastName,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ row }) => row.original.email,
    }),
    columnHelper.accessor("phoneNumber", {
      header: "Phone Number",
      cell: ({ row }) => row.original.phoneNumber,
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: ({ row }) => formatRole(row.original.role),
    }),
    columnHelper.accessor("cityIdNumber", {
      header: "City ID",
      cell: ({ row }) => row.original.cityIdNumber,
    }),
    columnHelper.accessor("OrganizationUnitId", {
      header: "Org Unit ID",
      cell: ({ row }) => row.original.OrganizationUnitId,
    }),
    columnHelper.accessor("activeStatus", {
      header: "Active",
      cell: ({ row }) => (row.original.activeStatus ? "Yes" : "No"),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <UserActionsMenu
          onEdit={() => onEdit(row.original)}
  
          onDelete={() => onDelete(row.original)}
        />
      ),
    }),
  ];
}
