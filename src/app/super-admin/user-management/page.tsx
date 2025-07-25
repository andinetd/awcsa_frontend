"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserTable from "./_components/UserTable";
import { getUserColumns, UserData } from "./_components/UserColumns";
import EditUserDialog from "./_components/EditUserDialog";
import ChangePermissionDialog from "./_components/ChangePermissionDialog";
import DeleteUserDialog from "./_components/DeleteUserDialog";
import AddUserDialog from "@/app/super-admin/user-management/_components/AddUserDialog";

import { KeyRound, Pencil, Trash, User } from "lucide-react";

const initialData: UserData[] = [
  {
    name: "Alice",
    email: "alice@example.com",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "2023-10-01",
    dateAdded: "2023-09-15",
  },
  {
    name: "Bob",
    email: "bob@example.com",
    access: ["Data Export", "Data Import"],
    lastActive: "2023-10-02",
    dateAdded: "2023-09-16",
  },
  {
    name: "Charlie",
    email: "charlie@example.com",
    access: ["Admin"],
    lastActive: "2023-10-03",
    dateAdded: "2023-09-17",
  },
  {
    name: "David",
    email: "david@example.com",
    access: ["Data Export"],
    lastActive: "2023-10-04",
    dateAdded: "2023-09-18",
  },
  {
    name: "Eve",
    email: "eve@example.com",
    access: ["Data Import"],
    lastActive: "2023-10-05",
    dateAdded: "2023-09-19",
  },
  {
    name: "Frank",
    email: "frank@example.com",
    access: ["Admin", "Data Import"],
    lastActive: "2023-10-06",
    dateAdded: "2023-09-20",
  },
  {
    name: "Grace",
    email: "grace@example.com",
    access: ["Data Export"],
    lastActive: "2023-10-07",
    dateAdded: "2023-09-21",
  },
  {
    name: "Heidi",
    email: "heidi@example.com",
    access: ["Data Import", "Data Export"],
    lastActive: "2023-10-08",
    dateAdded: "2023-09-22",
  },
  {
    name: "Ivan",
    email: "ivan@example.com",
    access: ["Admin"],
    lastActive: "2023-10-09",
    dateAdded: "2023-09-23",
  },
  {
    name: "Judy",
    email: "judy@example.com",
    access: ["Data Export", "Data Import"],
    lastActive: "2023-10-10",
    dateAdded: "2023-09-24",
  },
  {
    name: "Karl",
    email: "karl@example.com",
    access: ["Data Import"],
    lastActive: "2023-10-11",
    dateAdded: "2023-09-25",
  },
  {
    name: "Laura",
    email: "laura@example.com",
    access: ["Admin", "Data Export"],
    lastActive: "2023-10-12",
    dateAdded: "2023-09-26",
  },
  {
    name: "Mallory",
    email: "mallory@example.com",
    access: ["Data Import"],
    lastActive: "2023-10-13",
    dateAdded: "2023-09-27",
  },
  {
    name: "Niaj",
    email: "niaj@example.com",
    access: ["Data Export"],
    lastActive: "2023-10-14",
    dateAdded: "2023-09-28",
  },
  {
    name: "Olivia",
    email: "olivia@example.com",
    access: ["Admin", "Data Import"],
    lastActive: "2023-10-15",
    dateAdded: "2023-09-29",
  },
  {
    name: "Peggy",
    email: "peggy@example.com",
    access: ["Data Export", "Data Import"],
    lastActive: "2023-10-16",
    dateAdded: "2023-09-30",
  },
  {
    name: "Quentin",
    email: "quentin@example.com",
    access: ["Admin"],
    lastActive: "2023-10-17",
    dateAdded: "2023-10-01",
  },
  {
    name: "Rupert",
    email: "rupert@example.com",
    access: ["Data Import"],
    lastActive: "2023-10-18",
    dateAdded: "2023-10-02",
  },
  {
    name: "Sybil",
    email: "sybil@example.com",
    access: ["Data Export"],
    lastActive: "2023-10-19",
    dateAdded: "2023-10-03",
  },
  {
    name: "Trent",
    email: "trent@example.com",
    access: ["Admin", "Data Export"],
    lastActive: "2023-10-20",
    dateAdded: "2023-10-04",
  },
  {
    name: "Uma",
    email: "uma@example.com",
    access: ["Data Import"],
    lastActive: "2023-10-21",
    dateAdded: "2023-10-05",
  },
  {
    name: "Victor",
    email: "victor@example.com",
    access: ["Data Export", "Data Import"],
    lastActive: "2023-10-22",
    dateAdded: "2023-10-06",
  },
  {
    name: "Wendy",
    email: "wendy@example.com",
    access: ["Admin"],
    lastActive: "2023-10-23",
    dateAdded: "2023-10-07",
  },
  {
    name: "Xavier",
    email: "xavier@example.com",
    access: ["Data Import"],
    lastActive: "2023-10-24",
    dateAdded: "2023-10-08",
  },
  {
    name: "Yvonne",
    email: "yvonne@example.com",
    access: ["Data Export"],
    lastActive: "2023-10-25",
    dateAdded: "2023-10-09",
  },
  {
    name: "Zack",
    email: "zack@example.com",
    access: ["Admin", "Data Import"],
    lastActive: "2023-10-26",
    dateAdded: "2023-10-10",
  },
];

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [data, setData] = useState<UserData[]>(initialData);
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editOriginalEmail, setEditOriginalEmail] = useState<string | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const allRoles = useMemo(
    () => Array.from(new Set(data.flatMap((user) => user.access))),
    [data]
  );

  // Filtered data based on search and role
  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || user.access.includes(roleFilter);
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, data]);

  // Handlers for row actions

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setEditOriginalEmail(user.email);
    setEditDialogOpen(true);
  };

  const handleChangePermission = (user: UserData) => {
    setSelectedUser(user);
    setPermissionDialogOpen(true);
  };
  const handleDelete = (user: UserData) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const columns = useMemo(
    () =>
      getUserColumns({
        onEdit: handleEdit,
        onChangePermission: handleChangePermission,
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

  const handleEditSave = (user: UserData) => {
    setData((prev) =>
      prev.map((u) => (u.email === editOriginalEmail ? user : u))
    );
    setEditDialogOpen(false);
    setSelectedUser(null);
    setEditOriginalEmail(null);
  };
  const handlePermissionSave = (user: UserData) => {
    setData((prev) => prev.map((u) => (u.email === user.email ? user : u)));
    setPermissionDialogOpen(false);
    setSelectedUser(null);
  };
  const handleDeleteConfirm = (user: UserData) => {
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
      <ChangePermissionDialog
        open={permissionDialogOpen}
        user={selectedUser}
        allRoles={allRoles}
        onOpenChange={(open) => {
          setPermissionDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
        onSave={handlePermissionSave}
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
          allRoles={allRoles}
          onUserAdded={(user) => {
            setData((prev) => [
              ...prev,
              {
                ...user,
                lastActive: new Date().toISOString().slice(0, 10),
                dateAdded: new Date().toISOString().slice(0, 10),
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
                {roleFilter ? `Role: ${roleFilter}` : "Filter by Role"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                All Roles
              </DropdownMenuItem>
              {allRoles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setRoleFilter(role)}
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 hover:cursor-pointer"
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
