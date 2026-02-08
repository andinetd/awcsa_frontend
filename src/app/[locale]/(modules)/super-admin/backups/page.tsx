"use client";

import { Backup } from "@/types/super-admin";
import { useGetBackups } from "@/hooks/super-admin";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/columns";
import { Loader2, DatabaseBackup } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function BackupsPage() {
  const { data: backups = [], isLoading: loading } = useGetBackups();

  const fetchBackups = () => {
    // Queries invalidate automatically, but if manual refresh needed:
    // queryClient.invalidateQueries({ queryKey: ["backups"] })
    // For now we can just rely on auto-refetch or reload page.
    // Or we can expose refetch from hook
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Backups</h2>
          <p className="text-muted-foreground">Download database backups.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchBackups} variant="outline">
            <DatabaseBackup className="mr-2 h-4 w-4" /> Refresh List
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DataTable data={backups} columns={columns} />
      )}
    </div>
  );
}
