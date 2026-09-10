"use client";

import React, { useState, useMemo } from "react";
import { BureauReport, BureauReportFilters } from "@/api/bureau/reports";
import { ADDIS_ABABA_SUBCITIES } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowUpDown,
  Building,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { ReportDetailsModal } from "@/app/[locale]/(modules)/bureau-head/components/report-details-modal";

interface HeavyReportsHubProps {
  reports: BureauReport[];
  isLoading: boolean;
  isError: boolean;
  onFilterChange?: (filters: BureauReportFilters) => void;
  careCenters?: any[];
}

export function HeavyReportsHub({
  reports,
  isLoading,
  isError,
  onFilterChange,
  careCenters = [],
}: HeavyReportsHubProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [subCityFilter, setSubCityFilter] = useState<string>("ALL");
  const [selectedReport, setSelectedReport] = useState<BureauReport | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Month names
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Filtering reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        !searchTerm ||
        r.facility?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.facility?.subCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r.facilityId).includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" ||
        r.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesSubCity =
        subCityFilter === "ALL" ||
        r.facility?.subCity?.toLowerCase() === subCityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSubCity;
    });
  }, [reports, searchTerm, statusFilter, subCityFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  // Aggregates for Ribbon
  const totalReportsCount = reports.length;
  const approvedCount = reports.filter(
    (r) => r.status === "Approved" || r.status === "Submitted"
  ).length;
  const pendingCount = reports.filter(
    (r) => r.status === "Pending" || !r.status
  ).length;
  const overdueCount = Math.max(0, (careCenters.length || 18) - totalReportsCount);
  const totalChildrenInReports = reports.reduce(
    (sum, r) => sum + (r.totalChildren || 0),
    0
  );

  // CSV Export handler
  const handleExportCSV = () => {
    if (filteredReports.length === 0) return;
    const headers = [
      "Facility Name",
      "Facility ID",
      "Sub-City",
      "Period",
      "Total Children",
      "Admissions",
      "Discharges",
      "Status",
      "Submitted Date",
    ];
    const rows = filteredReports.map((r) => [
      `"${r.facility?.name || "Facility #" + r.facilityId}"`,
      r.facilityId,
      `"${r.facility?.subCity || ""}"`,
      `"${months[(r.month || 1) - 1]} ${r.year || ""}"`,
      r.totalChildren || 0,
      r.newAdmissions || 0,
      r.discharges || 0,
      `"${r.status || "Pending"}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "-"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bureau-reports-dataset-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Compliance Metric Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-border/80 bg-card/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Reported</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">
            {totalReportsCount}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Across {careCenters.length || 18} accredited facilities
          </p>
        </Card>

        <Card className="p-4 border-border/80 bg-card/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Approved / In Order</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">
            {approvedCount}
          </h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            {totalReportsCount > 0
              ? `${Math.round((approvedCount / totalReportsCount) * 100)}% validated`
              : "100% validated"}
          </p>
        </Card>

        <Card className="p-4 border-border/80 bg-card/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Pending Review</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">
            {pendingCount}
          </h4>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Awaiting executive clearance
          </p>
        </Card>

        <Card className="p-4 border-border/80 bg-card/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Reported Children</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-foreground font-mono mt-1">
            {totalChildrenInReports.toLocaleString()}
          </h4>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Directly verified in facilities
          </p>
        </Card>
      </div>

      {/* 2. Search & Filter Bar */}
      <Card className="p-4 border-border/80 bg-card/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search facility or sub-city..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <div className="w-[140px]">
              <Select
                value={subCityFilter}
                onValueChange={(val) => {
                  setSubCityFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Sub-City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Sub-Cities</SelectItem>
                  {ADDIS_ABABA_SUBCITIES.map((sc) => (
                    <SelectItem key={sc} value={sc}>
                      {sc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[130px]">
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredReports.length === 0}
              className="h-9 gap-1.5 text-xs font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. High-Density Reports Grid */}
      <Card className="overflow-hidden border-border/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/50 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Care Facility</th>
                <th className="px-4 py-3">Location / Sub-City</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3 text-right">Total Children</th>
                <th className="px-4 py-3 text-center">Net Movement</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Submitted At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span>Loading bureau facility reports...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-destructive">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold">Unable to fetch reports</p>
                    <p className="text-xs text-muted-foreground">Check connection or parameters</p>
                  </td>
                </tr>
              ) : paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-foreground">No reports match your filters</p>
                    <p className="text-xs text-muted-foreground">Try clearing search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedReports.map((report) => {
                  const facilityName =
                    report.facility?.name || `Facility #${report.facilityId}`;
                  const subCity = report.facility?.subCity || "Addis Ababa";
                  const period = `${months[(report.month || 1) - 1]} ${report.year || 2026}`;
                  const admissions = report.newAdmissions || 0;
                  const discharges = report.discharges || 0;
                  const netDelta = admissions - discharges;

                  const isApproved =
                    report.status === "Approved" || report.status === "Submitted";

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-foreground">
                          {facilityName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          ID: #{report.facilityId}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="font-normal text-[11px] bg-background/50 border-border/80"
                        >
                          {subCity}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground font-mono">
                        {period}
                      </td>

                      <td className="px-4 py-3 text-right font-mono font-bold text-foreground">
                        {Number(report.totalChildren || 0).toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="text-emerald-600">+{admissions}</span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-rose-600">-{discharges}</span>
                          <span
                            className={`ml-1 font-bold ${
                              netDelta > 0
                                ? "text-emerald-600"
                                : netDelta < 0
                                ? "text-rose-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            ({netDelta > 0 ? `+${netDelta}` : netDelta})
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isApproved
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isApproved ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {report.status || "Submitted"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {report.submittedAt
                          ? new Date(report.submittedAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setIsDetailsOpen(true);
                          }}
                          className="h-8 gap-1 text-xs hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="font-semibold text-foreground">
              {filteredReports.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>
            <span>to</span>
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * pageSize, filteredReports.length)}
            </span>
            <span>of</span>
            <span className="font-semibold text-foreground font-mono">
              {filteredReports.length}
            </span>
            <span>reports</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs"
            >
              Previous
            </Button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Details modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
