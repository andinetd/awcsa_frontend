"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserTable from "./_components/UserTable";
import type { RegisterEmployeeDto } from "@/types/employee";
import { EmployeeRole } from "./types";
import { mockEmployeeData } from "@/lib/mock-data";
import { getUserColumns } from "./_components/UserColumns";
import EditUserDialog from "./_components/EditUserDialog";
import DeleteUserDialog from "./_components/DeleteUserDialog";
import AddUserDialog from "@/app/[locale]/super-admin/user-management/_components/AddUserDialog";
import { formatRole } from "@/lib/utils";

const initialData: RegisterEmployeeDto[] = mockEmployeeData;

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | null>(null);
  const [data, setData] = useState<RegisterEmployeeDto[]>(initialData);
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editOriginalEmail, setEditOriginalEmail] = useState<string | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<RegisterEmployeeDto | null>(
    null
  );

  const allRoles: string[] = useMemo(
    () => Array.from(new Set(data.map((user) => user.role))),
    [data]
  );

  // Filtered data based on search and role
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.cityIdNumber.toLowerCase().includes(search.toLowerCase()) ||
        user.phoneNumber.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, data]);

  // Handlers for row actions

  const handleEdit = (user: RegisterEmployeeDto) => {
    setSelectedUser(user);
    setEditOriginalEmail(user.email);
    setEditDialogOpen(true);
  };

  const handleChangePermission = (user: RegisterEmployeeDto) => {
    setSelectedUser(user);
    setPermissionDialogOpen(true);
  };
  const handleDelete = (user: RegisterEmployeeDto) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [data]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: filteredData.length,
  });

  // Save handlers for dialogs

  const handleEditSave = (user: RegisterEmployeeDto) => {
    setData((prev) =>
      prev.map((u) => (u.email === editOriginalEmail ? user : u))
    );
    setEditDialogOpen(false);
    setSelectedUser(null);
    setEditOriginalEmail(null);
  };

  const handleDeleteConfirm = (user: RegisterEmployeeDto) => {
    setData((prev) => prev.filter((u) => u.email !== user.email));
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <SidebarLayout title="User Management">
      <EditUserDialog
        open={editDialogOpen}
        user={selectedUser}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
        onSave={handleEditSave}
      />
      <DeleteUserDialog
        open={deleteDialogOpen}
        user={selectedUser}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
        onDelete={handleDeleteConfirm}
      />
      <div className="flex space-x-2 justify-between items-center ">
        <AddUserDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          allRoles={allRoles as EmployeeRole[]}
          onUserAdded={(user) => {
            setData((prev) => [
              ...prev,
              {
                ...user,
                activeStatus: true,
              },
            ]);
            setDialogOpen(false);
          }}
        />
        <Input
          placeholder="Search"
          className=" w-[50%]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-300 hover:cursor-pointer">
                {roleFilter
                  ? `Role: ${formatRole(roleFilter)}`
                  : "Filter by Role"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                All Roles
              </DropdownMenuItem>
              {allRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setRoleFilter(role as EmployeeRole)}
                >
                  {formatRole(role)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="px-4 py-2 rounded-md text-sm hover:cursor-pointer"
            onClick={() => setDialogOpen(true)}
          >
            + Add user
          </Button>
        </div>
      </div>
      <UserTable table={table} />
    </SidebarLayout>
  );
}
