"use client";

import { SidebarLayout } from "@/components/shared/sidebar-layout";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddUserDialog from "@/components/AddUserDialog";

import { KeyRound, Pencil, Trash, User } from "lucide-react";


type UserData = {
  name: string;
  email: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
};

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
    email: "harlie@example.com",
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
    email: "eve@exmaple.com",
    access: ["Data Import"],
    lastActive: "2023-10-05",
    dateAdded: "2023-09-19",
  }
];

const columnHelper = createColumnHelper<UserData>();

const columns = [
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
    cell: () => (
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v.01M12 12v.01M12 18v.01"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <User />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil />
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <KeyRound />
              Change permission
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash />
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }),
]



export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState<UserData[]>(initialData);
  

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

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <SidebarLayout title="User Management">
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
          <Button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 hover:cursor-pointer" onClick={() => setDialogOpen(true)}>
            + Add user
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-left text-sm font-medium text-gray-600 px-4 py-2 bg-gray-50 ${
                      header.column.columnDef.meta?.hideOnMobile
                        ? "hidden md:table-cell"
                        : ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="rounded-md shadow-sm">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`bg-white px-4 py-2 text-sm text-gray-800 ${
                      cell.column.columnDef.meta?.hideOnMobile
                        ? "hidden md:table-cell"
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SidebarLayout>
  );
}
