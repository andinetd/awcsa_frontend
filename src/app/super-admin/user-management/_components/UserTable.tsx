import React from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  table: Table<any>;
}

const UserTable: React.FC<UserTableProps> = ({ table }) => (
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="hover:cursor-pointer"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="hover:cursor-pointer"
        >
          Next
        </Button>
    </div>
  </div>
);

export default UserTable;
