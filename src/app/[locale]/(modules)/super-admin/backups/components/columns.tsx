"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Backup } from "@/types/super-admin";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Download, HardDrive } from "lucide-react";
import { downloadBackup } from "@/api/super-admin/backups";
import { toast } from "sonner";

export const columns: ColumnDef<Backup>[] = [
  {
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Filename" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HardDrive className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{row.original.filename}</span>
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => {
      // Convert bytes to KB/MB
      const bytes = row.original.size;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes === 0) return "0 Byte";
      const i = parseInt(
        Math.floor(Math.log(bytes) / Math.log(1024)).toString(),
      );
      return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const handleDownload = async () => {
        try {
          toast.info("Starting download...");
          await downloadBackup(row.original.filename);
          toast.success("Download started");
        } catch (error) {
          toast.error("Download failed");
        }
      };

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          title="Download Backup"
        >
          <Download className="h-4 w-4 mr-2" /> Download
        </Button>
      );
    },
  },
];
