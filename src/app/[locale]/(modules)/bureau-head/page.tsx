"use client";

import React, { useState, useMemo } from "react";
import { useBureauDashboardSummary } from "@/hooks/bureau/useBureauDashboard";
import { useBureauReports } from "@/hooks/bureau/useBureauReports";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { BureauReport, BureauReportFilters } from "@/api/bureau/reports";
import { ReportDetailsModal } from "./components/report-details-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  HandHelping,
  File,
  HandHeart,
  Filter,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedStatsOverview } from "@/components/dashboard/UnifiedStatsOverview";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { useGetDashboardAnalyticsQuery } from "@/hooks/dashboard/useAnalytics";

const BureauHead = () => {
  const t = useTranslations("bureau");
  const { data: stats, isLoading: isStatsLoading } =
    useBureauDashboardSummary();
  const { data: careCenters } = useGetCareCentersQuery();
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetDashboardAnalyticsQuery();

  // Search Filters State (Form)
  const [filters, setFilters] = useState<BureauReportFilters>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    subCity: "",
    facilityId: 0,
  });

  // Active Filters for Query (initially empty to fetch all)
  const [activeFilters, setActiveFilters] = useState<BureauReportFilters>({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BureauReport | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    data: reportsData,
    isLoading: isReportsLoading,
    isError,
  } = useBureauReports(activeFilters, true);

  const handleSearch = () => {
    setActiveFilters(filters);
    setIsDialogOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "subCity" ? value : Number(value),
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const columns: ColumnDef<BureauReport>[] = useMemo(
    () => [
      {
        accessorKey: "facility.name",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("reports.table.facility")}
          />
        ),
        cell: ({ row }) => (
          <div className="font-medium text-zinc-900">
            {row.original.facility?.name ||
              `${t("reports.table.facility")} #${row.original.facilityId}`}
          </div>
        ),
      },
      {
        id: "period",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("reports.table.period")}
          />
        ),
        cell: ({ row }) => {
          const { month, year } = row.original;
          return (
            <div className="text-zinc-600">
              {t(`monthsShort.${month}`)} {year}
            </div>
          );
        },
      },
      {
        accessorKey: "totalChildren",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("reports.table.totalChildren")}
          />
        ),
        cell: ({ row }) => (
          <div className="text-zinc-600">{row.getValue("totalChildren")}</div>
        ),
      },
      {
        accessorKey: "submittedAt",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("reports.table.submittedAt")}
          />
        ),
        cell: ({ row }) => {
          const date = row.getValue("submittedAt") as string;
          return (
            <div className="text-zinc-600">
              {date ? new Date(date).toLocaleDateString() : "-"}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("reports.table.status")}
          />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "Submitted" || status === "Approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {status || t("reports.table.unknown")}
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const report = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {t("reports.table.actions")}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedReport(report);
                    setIsDetailsOpen(true);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t("reports.table.viewDetails")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  if (isStatsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">
          {t("dashboard.loading")}
        </div>
      </div>
    );
  }

  // Assuming reportsData is the array, or nested in data field. Adjusting for list return.
  const reports = Array.isArray(reportsData)
    ? reportsData
    : (reportsData as any)?.data || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {t("dashboard.title")}
        </h1>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">{t("reports.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <UnifiedStatsOverview
            stats={[
              {
                key: "children",
                label: t("dashboard.stats.totalChildren"),
                value: stats?.totalChildren || 0,
                icon: HandHeart,
                color: "text-sky-500",
                bg: "bg-sky-50 dark:bg-sky-900/20",
                border: "border-sky-100 dark:border-sky-800",
              },
              {
                key: "facilities",
                label: t("dashboard.stats.totalFacilities"),
                value: stats?.totalFacilities || 0,
                icon: HandHelping,
                color: "text-emerald-500",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                border: "border-emerald-100 dark:border-emerald-800",
              },
              {
                key: "submitted",
                label: t("dashboard.stats.submittedReports"),
                value: stats?.submittedReports || 0,
                icon: File,
                color: "text-cyan-500",
                bg: "bg-cyan-50 dark:bg-cyan-900/20",
                border: "border-cyan-100 dark:border-cyan-800",
              },
              {
                key: "pending",
                label: t("dashboard.stats.pendingReports"),
                value: stats?.pendingReports || 0,
                icon: File,
                color: "text-teal-500",
                bg: "bg-teal-50 dark:bg-teal-900/20",
                border: "border-teal-100 dark:border-teal-800",
              },
            ]}
          />
          {analytics && <AnalyticsCharts data={analytics} />}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
              {t("reports.title")}
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 hover:cursor-pointer"
                >
                  <Filter className="w-4 h-4" />
                  {t("reports.filter.button")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("reports.filter.dialogTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("reports.filter.dialogDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="year" className="text-right">
                      {t("reports.filter.year")}
                    </Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={filters.year}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="month" className="text-right">
                      {t("reports.filter.month")}
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={filters.month?.toString()}
                        onValueChange={(val) =>
                          handleSelectChange("month", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("reports.filter.selectMonth")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {t(`months.${i + 1}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subCity" className="text-right">
                      {t("reports.filter.subCity")}
                    </Label>
                    <Input
                      id="subCity"
                      name="subCity"
                      value={filters.subCity}
                      onChange={handleInputChange}
                      placeholder={t("reports.filter.subCityPlaceholder")}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="facilityId" className="text-right">
                      {t("reports.filter.facility")}
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={filters.facilityId?.toString()}
                        onValueChange={(val) =>
                          handleSelectChange("facilityId", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("reports.filter.selectFacility")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">
                            {t("reports.filter.allFacilities")}
                          </SelectItem>
                          {careCenters?.map((center: any) => (
                            <SelectItem
                              key={center.id}
                              value={center.id.toString()}
                            >
                              {center.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSearch}
                    className="hover:cursor-pointer"
                  >
                    {t("reports.filter.search")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Results Table */}
          <div className="">
            {isReportsLoading ? (
              <div className="p-8 mt-4 text-center text-muted-foreground flex items-center justify-center h-full">
                {t("reports.loading")}
              </div>
            ) : isError ? (
              <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center h-full gap-2">
                <p>{t("reports.error")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("reports.errorDescription")}
                </p>
              </div>
            ) : (
              <DataTable columns={columns} data={reports} />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default BureauHead;
