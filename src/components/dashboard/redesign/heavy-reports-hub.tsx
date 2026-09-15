"use client";

import React, { useState, useMemo } from "react";
import { BureauReport, BureauReportFilters } from "@/api/bureau/reports";
import { ADDIS_ABABA_SUBCITIES } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileSpreadsheet,
  Filter,
  MapPin,
  Search,
} from "lucide-react";
import { ReportDetailsModal } from "@/app/[locale]/(modules)/bureau-head/components/report-details-modal";

interface HeavyReportsHubProps {
  reports: BureauReport[];
  isLoading: boolean;
  isError: boolean;
  onFilterChange?: (filters: BureauReportFilters) => void;
  careCenters?: any[];
  selectedSubCity?: string;
}

export function HeavyReportsHub({
  reports,
  isLoading,
  isError,
  onFilterChange,
  careCenters = [],
  selectedSubCity = "ALL",
}: HeavyReportsHubProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [subCityFilter, setSubCityFilter] = useState<string>(selectedSubCity);
  const [selectedReport, setSelectedReport] = useState<BureauReport | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Month names
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Keep subCity in sync if passed
  React.useEffect(() => {
    if (selectedSubCity) {
      setSubCityFilter(selectedSubCity);
    }
  }, [selectedSubCity]);

  // Filtering
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

  // Statistics
  const totalExpected = careCenters.length || 18;
  const totalSubmitted = reports.length;
  const approvedCount = reports.filter(
    (r) => r.status === "Approved" || r.status === "Submitted"
  ).length;
  const pendingCount = reports.filter(
    (r) => r.status === "Pending" || !r.status
  ).length;
  const overdueCount = Math.max(0, totalExpected - totalSubmitted);
  const totalChildrenReported = reports.reduce(
    (acc, r) => acc + (r.totalChildren || 0),
    0
  );

  // Export CSV
  const handleExportCSV = () => {
    if (filteredReports.length === 0) return;
    const headers = [
      "Facility Name",
      "License ID",
      "Sub-City",
      "Period",
      "Total Children",
      "New Admissions",
      "Discharges",
      "Net Movement",
      "Compliance Status",
      "Submission Date",
    ];
    const rows = filteredReports.map((r) => [
      `"${r.facility?.name || "Facility #" + r.facilityId}"`,
      r.facilityId,
      `"${r.facility?.subCity || ""}"`,
      `"${months[(r.month || 1) - 1]} ${r.year || ""}"`,
      r.totalChildren || 0,
      r.newAdmissions || 0,
      r.discharges || 0,
      (r.newAdmissions || 0) - (r.discharges || 0),
      `"${r.status || "Pending"}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "-"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `awcsa-facility-census-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* 1. Institutional Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Expected Facilities
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#123B5D]">
              {totalExpected}
            </span>
            <span className="text-xs text-slate-500">Accredited Centers</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Licensed residential child care facilities
          </p>
        </div>

        <div className="rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none border-l-4 border-l-[#168C86]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Submitted & Verified
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#168C86]">
              {approvedCount}
            </span>
            <span className="text-xs text-slate-500">Dossiers In Order</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Compliant with monthly census mandate
          </p>
        </div>

        <div className="rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none border-l-4 border-l-[#C98A16]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Pending Bureau Clearance
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#C98A16]">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-500">Under Review</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Awaiting inspector sign-off
          </p>
        </div>

        <div className={`rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none border-l-4 ${
          overdueCount > 0 ? "border-l-[#DC2626]" : "border-l-[#168C86]"
        }`}>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Overdue Non-Compliant
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className={`text-xl font-bold font-mono ${overdueCount > 0 ? "text-[#DC2626]" : "text-slate-700"}`}>
              {overdueCount}
            </span>
            <span className="text-xs text-slate-500">Facilities Due</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {overdueCount > 0 ? "Escalation notice required" : "Zero non-compliance"}
          </p>
        </div>
      </div>

      {/* 2. Institutional Search & Filter Bar */}
      <div className="rounded-md border border-[#E3E7EB] bg-white p-3 shadow-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search facility name or license ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-8 text-xs border-[#E3E7EB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <Select
              value={subCityFilter}
              onValueChange={(val) => {
                setSubCityFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs border-[#E3E7EB]">
                <MapPin className="mr-1 h-3.5 w-3.5 text-slate-500" />
                <SelectValue placeholder="All Sub-Cities" />
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

            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[130px] text-xs border-[#E3E7EB]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredReports.length === 0}
              className="h-8 border-[#E3E7EB] px-2.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-[#1769AA]" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Government Registry Table */}
      <div className="rounded-md border border-[#E3E7EB] bg-white shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E3E7EB] bg-[#F7F8FA] font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">Facility Name & Accreditation</th>
                <th className="px-4 py-3">Sub-City</th>
                <th className="px-4 py-3">Reporting Period</th>
                <th className="px-4 py-3 text-right">In-Center Children</th>
                <th className="px-4 py-3 text-center">Admissions / Discharges</th>
                <th className="px-4 py-3 text-center">Compliance Status</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7EB] font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1769AA] border-t-transparent" />
                      <span className="text-xs">Loading facility census registry...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#DC2626]">
                    <AlertCircle className="h-6 w-6 mx-auto mb-1 opacity-80" />
                    <p className="font-semibold text-xs">Failed to fetch facility records</p>
                  </td>
                </tr>
              ) : paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    <FileSpreadsheet className="h-6 w-6 mx-auto mb-1 text-slate-400" />
                    <p className="font-semibold text-xs text-slate-700">No reports found matching filters</p>
                  </td>
                </tr>
              ) : (
                paginatedReports.map((r) => {
                  const facilityName = r.facility?.name || `Residential Care Center #${r.facilityId}`;
                  const subCity = r.facility?.subCity || "Addis Ababa";
                  const period = `${months[(r.month || 1) - 1]} ${r.year || 2026}`;
                  const admissions = r.newAdmissions || 0;
                  const discharges = r.discharges || 0;
                  const net = admissions - discharges;

                  const isApproved = r.status === "Approved" || r.status === "Submitted";

                  return (
                    <tr key={r.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="font-bold text-[#123B5D]">{facilityName}</div>
                        <div className="text-[11px] font-mono text-slate-400">License ID: #{r.facilityId}</div>
                      </td>

                      <td className="px-4 py-2.5 text-slate-600">
                        {subCity}
                      </td>

                      <td className="px-4 py-2.5 font-mono text-slate-600">
                        {period}
                      </td>

                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                        {Number(r.totalChildren || 0).toLocaleString()}
                      </td>

                      <td className="px-4 py-2.5 text-center font-mono text-xs">
                        <span className="text-[#168C86]">+{admissions}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-600">-{discharges}</span>
                        <span className={`ml-1.5 font-bold ${net > 0 ? "text-[#168C86]" : net < 0 ? "text-[#DC2626]" : "text-slate-500"}`}>
                          ({net > 0 ? `+${net}` : net})
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold ${
                            isApproved
                              ? "bg-teal-50 text-[#168C86]"
                              : "bg-amber-50 text-[#C98A16]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isApproved ? "bg-[#168C86]" : "bg-[#C98A16]"
                            }`}
                          />
                          {r.status || "Submitted"}
                        </span>
                      </td>

                      <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("en-GB") : "-"}
                      </td>

                      <td className="px-4 py-2.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(r);
                            setIsDetailsOpen(true);
                          }}
                          className="h-7 px-2 text-xs text-[#1769AA] hover:bg-[#1769AA]/10"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>Inspect</span>
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
        <div className="flex items-center justify-between border-t border-[#E3E7EB] bg-[#F7F8FA] px-4 py-2.5 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-700">{filteredReports.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{" "}
            <strong className="text-slate-700">{Math.min(currentPage * pageSize, filteredReports.length)}</strong> of{" "}
            <strong className="text-slate-700 font-mono">{filteredReports.length}</strong> reports
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 text-xs border-[#E3E7EB]"
            >
              Prev
            </Button>
            <span className="px-2 text-slate-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 text-xs border-[#E3E7EB]"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
