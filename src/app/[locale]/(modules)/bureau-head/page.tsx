"use client";
import StatsCard from "@/components/shared/card/statistics-card";
import {
  HandHelping,
  File,
  HandHeart,
  Filter,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { useBureauDashboardSummary } from "@/hooks/bureau/useBureauDashboard";
import { useBureauReports } from "@/hooks/bureau/useBureauReports";
import { useGetCareCentersQuery } from "@/hooks/adoption/care-center";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

const chartData = [
  { day: 1, applications: 3 },
  { day: 2, applications: 4 },
  { day: 3, applications: 8 },
  { day: 4, applications: 3 },
  { day: 5, applications: 5 },
  { day: 6, applications: 20 },
  { day: 7, applications: 10 },
  { day: 8, applications: 1 },
  { day: 9, applications: 2 },
  { day: 10, applications: 7 },
];

const chartData2 = [
  { day: 1, applications: 3 },
  { day: 2, applications: 4 },
  { day: 3, applications: 3 },
  { day: 4, applications: 9 },
  { day: 5, applications: 5 },
  { day: 6, applications: 15 },
  { day: 7, applications: 10 },
  { day: 8, applications: 1 },
  { day: 9, applications: 13 },
  { day: 10, applications: 4 },
];

const chartConfig = {
  children: {
    label: "Children",
    color: "hsl(var(--chart-1))",
  },
  facilities: {
    label: "Facilities",
    color: "hsl(var(--chart-2))",
  },
  submitted: {
    label: "Submitted",
    color: "hsl(var(--chart-3))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-5))",
  },
};

const BureauHead = () => {
  const { data: stats, isLoading: isStatsLoading } =
    useBureauDashboardSummary();

  const { data: careCenters } = useGetCareCentersQuery();

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
          <DataTableColumnHeader column={column} title="Facility" />
        ),
        cell: ({ row }) => (
          <div className="font-medium text-zinc-900">
            {row.original.facility?.name ||
              `Facility #${row.original.facilityId}`}
          </div>
        ),
      },
      {
        id: "period",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Period" />
        ),
        cell: ({ row }) => {
          const { month, year } = row.original;
          return (
            <div className="text-zinc-600">
              {new Date(0, month - 1).toLocaleString("default", {
                month: "short",
              })}{" "}
              {year}
            </div>
          );
        },
      },
      {
        accessorKey: "totalChildren",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Total Children" />
        ),
        cell: ({ row }) => (
          <div className="text-zinc-600">{row.getValue("totalChildren")}</div>
        ),
      },
      {
        accessorKey: "submittedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Submitted At" />
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
          <DataTableColumnHeader column={column} title="Status" />
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
              {status || "Unknown"}
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedReport(report);
                    setIsDetailsOpen(true);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
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
          Loading dashboard statistics...
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
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            chartConfig={chartConfig}
            chartData={chartData2}
            title="Total Children"
            dataKey="children"
            icon={HandHeart}
            value={stats?.totalChildren || 0}
          />
          <StatsCard
            chartConfig={chartConfig}
            chartData={chartData}
            title="Total Facilities"
            dataKey="facilities"
            icon={HandHelping}
            value={stats?.totalFacilities || 0}
          />
          <StatsCard
            chartConfig={chartConfig}
            chartData={chartData2}
            title="Submitted Reports"
            dataKey="submitted"
            icon={File}
            value={stats?.submittedReports || 0}
          />
          <StatsCard
            chartConfig={chartConfig}
            chartData={chartData}
            title="Pending Reports"
            dataKey="pending"
            icon={File}
            value={stats?.pendingReports || 0}
          />
        </div>
      </div>

      {/* Reports Section with Dialog Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Reports
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter Reports
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search Reports</DialogTitle>
                <DialogDescription>
                  Filter reports by year, month, location, or facility ID.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
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
                    Month
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={filters.month?.toString()}
                      onValueChange={(val) => handleSelectChange("month", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {new Date(0, i).toLocaleString("default", {
                              month: "long",
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subCity" className="text-right">
                    Sub-City
                  </Label>
                  <Input
                    id="subCity"
                    name="subCity"
                    value={filters.subCity}
                    onChange={handleInputChange}
                    placeholder="e.g. Bole"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="facilityId" className="text-right">
                    Facility
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={filters.facilityId?.toString()}
                      onValueChange={(val) =>
                        handleSelectChange("facilityId", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Facility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">All Facilities</SelectItem>
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
                <Button onClick={handleSearch}>Search Results</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Results Table */}
        <div className="">
          {isReportsLoading ? (
            <div className="p-8 mt-4 text-center text-muted-foreground flex items-center justify-center h-full">
              Loading...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500 flex flex-col items-center justify-center h-full gap-2">
              <p>Failed to fetch reports.</p>
              <p className="text-xs text-muted-foreground">
                Check your inputs or try again later.
              </p>
            </div>
          ) : (
            <DataTable columns={columns} data={reports} />
          )}
        </div>
      </div>
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default BureauHead;
