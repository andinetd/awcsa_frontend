"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Backup } from "@/types/super-admin";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Download, HardDrive } from "lucide-react";
import { downloadBackup } from "@/api/super-admin/backups";
import { toast } from "sonner";

interface ColumnsProps {
  t: (key: string) => string;
}

export const getColumns = ({ t }: ColumnsProps): ColumnDef<Backup>[] => [
  {
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("filename")} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 py-0.5">
        <HardDrive className="h-3.5 w-3.5 text-[#1769AA]" />
        <span className="font-mono text-xs font-semibold text-[#0B1F3A]">{row.original.filename}</span>
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("size")} />
    ),
    cell: ({ row }) => {
      // Convert bytes to KB/MB
      const bytes = row.original.size;
      if (bytes === 0) return <span className="font-mono text-xs text-slate-600">0 Byte</span>;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = parseInt(
        Math.floor(Math.log(bytes) / Math.log(1024)).toString(),
      );
      return (
        <span className="font-mono text-xs text-slate-600">
          {Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i]}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: t("actions"),
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
          variant="outline"
          size="sm"
          onClick={handleDownload}
          title={t("download")}
          className="h-7 px-2.5 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50 gap-1.5 shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-slate-500" /> {t("download")}
        </Button>
      );
    },
  },
];
