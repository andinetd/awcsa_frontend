"use client";

import React, { useState } from "react";
import { Complaint, ComplaintStatus } from "@/types/complaints";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  MessageSquareWarning,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface ComplaintsRegistryProps {
  complaints?: Complaint[];
  isLoading?: boolean;
}

export function ComplaintsRegistry({
  complaints = [],
  isLoading = false,
}: ComplaintsRegistryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Fallback domain data if no complaints exist yet in database
  const defaultComplaints: Complaint[] = [
    {
      id: "CMP-2026-081",
      subject: "Delay in Foster Care Allowance Disbursal",
      description: "Foster mother in Yeka Woreda 03 reporting delay in Q2 monthly foster child maintenance subsidy.",
      category: "PROCESS_DELAY" as any,
      status: ComplaintStatus.PENDING,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      submittedById: 104,
      submittedBy: {
        email: "foster.care@awcsa.gov.et",
        client: {
          id: 104,
          cityIdNumber: "AA-YK-4920",
          firstName: "Almaz",
          lastName: "Tadesse",
          phoneNumber: "+251 91 123 4567",
          address: "Yeka Sub-City, Woreda 03",
          dateOfBirth: null,
          clientCategory: "FOSTER_PARENT",
          educationLevel: "Secondary",
          occupation: "Self-Employed",
          monthlyIncome: null,
          spouseCityIdNumber: null,
          familyMembersCount: 4,
          contactInfo: { email: "", phoneNumber: "+251 91 123 4567" },
          activeStatus: true,
          isDeleted: false,
          createdAt: "",
          updatedAt: "",
        },
      },
    },
    {
      id: "CMP-2026-079",
      subject: "Elderly Social Pension Biometric Enrollment Issue",
      description: "Elderly citizen unable to register fingerprint for monthly electronic food voucher.",
      category: "SYSTEM_ERROR" as any,
      status: ComplaintStatus.IN_PROGRESS,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      submittedById: 89,
      submittedBy: {
        email: "citizen@awcsa.gov.et",
        client: {
          id: 89,
          cityIdNumber: "AA-KR-1192",
          firstName: "Bekele",
          lastName: "Worku",
          phoneNumber: "+251 92 345 6789",
          address: "Kirkos Sub-City, Woreda 08",
          dateOfBirth: null,
          clientCategory: "ELDERLY",
          educationLevel: "Primary",
          occupation: "Retired",
          monthlyIncome: null,
          spouseCityIdNumber: null,
          familyMembersCount: 1,
          contactInfo: { email: "", phoneNumber: "+251 92 345 6789" },
          activeStatus: true,
          isDeleted: false,
          createdAt: "",
          updatedAt: "",
        },
      },
    },
    {
      id: "CMP-2026-074",
      subject: "Unlicensed Residential Care Facility Report",
      description: "Citizen alert regarding informal unregistered children center operating in Kolfe Keranio.",
      category: "OTHER" as any,
      status: ComplaintStatus.IN_PROGRESS,
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      submittedById: 42,
    },
    {
      id: "CMP-2026-068",
      subject: "Adoption Dossier Certification Request",
      description: "Applicant requesting clarification on court decree submission schedule.",
      category: "DOCUMENTATION_ISSUE" as any,
      status: ComplaintStatus.RESOLVED,
      createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      submittedById: 33,
    },
  ];

  const list = complaints.length > 0 ? complaints : defaultComplaints;

  const filtered = list.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalComplaints = list.length;
  const pendingCount = list.filter((c) => c.status === ComplaintStatus.PENDING).length;
  const inProgressCount = list.filter((c) => c.status === ComplaintStatus.IN_PROGRESS).length;
  const resolvedCount = list.filter((c) => c.status === ComplaintStatus.RESOLVED).length;

  return (
    <div className="space-y-4">
      {/* 1. Summary Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Grievances Filed
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#123B5D]">
              {totalComplaints}
            </span>
            <span className="text-xs text-slate-500">Citizen Appeals</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Formal administrative inquiries</p>
        </div>

        <div className="rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none border-l-4 border-l-[#C98A16]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Pending Investigation
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#C98A16]">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-500">Awaiting Triage</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Requires expert assignment</p>
        </div>

        <div className="rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none border-l-4 border-l-[#1769AA]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Active In-Progress
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#1769AA]">
              {inProgressCount}
            </span>
            <span className="text-xs text-slate-500">Under Social Worker Review</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Field inquiries underway</p>
        </div>

        <div className="rounded-md border border-[#E3E7EB] bg-white p-3.5 shadow-none border-l-4 border-l-[#168C86]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Successfully Resolved
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-[#168C86]">
              {resolvedCount}
            </span>
            <span className="text-xs text-slate-500">Cases Closed</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Official resolution delivered</p>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="rounded-md border border-[#E3E7EB] bg-white p-3 shadow-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search ticket ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs border-[#E3E7EB]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[140px] text-xs border-[#E3E7EB]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value={ComplaintStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ComplaintStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={ComplaintStatus.RESOLVED}>Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Link
              href="/complaints"
              className="inline-flex items-center text-xs font-semibold text-[#1769AA] hover:underline px-2.5 py-1 border border-[#E3E7EB] rounded-sm bg-white"
            >
              <span>Full Complaints Portal</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. High-Density Grievances Table */}
      <div className="rounded-md border border-[#E3E7EB] bg-white shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E3E7EB] bg-[#F7F8FA] font-semibold text-slate-600">
              <tr>
                <th className="px-4 py-3">Ticket ID & Nature of Grievance</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Submitter / Client ID</th>
                <th className="px-4 py-3">Filing Date</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E7EB] font-medium text-slate-700">
              {filtered.map((c) => {
                const isPending = c.status === ComplaintStatus.PENDING;
                const isInProgress = c.status === ComplaintStatus.IN_PROGRESS;
                const isResolved = c.status === ComplaintStatus.RESOLVED;

                return (
                  <tr key={c.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-[#123B5D]">{c.subject}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{c.description}</div>
                    </td>

                    <td className="px-4 py-2.5">
                      <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-xs">
                        {c.category}
                      </span>
                    </td>

                    <td className="px-4 py-2.5">
                      <div className="text-slate-800">
                        {c.submittedBy?.client?.firstName ? `${c.submittedBy.client.firstName} ${c.submittedBy.client.lastName}` : "Registered Citizen"}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {c.submittedBy?.client?.cityIdNumber || `ID: #${c.submittedById}`}
                      </div>
                    </td>

                    <td className="px-4 py-2.5 text-slate-500 font-mono text-[11px]">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB") : "-"}
                    </td>

                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold ${
                          isPending
                            ? "bg-amber-50 text-[#C98A16]"
                            : isInProgress
                            ? "bg-blue-50 text-[#1769AA]"
                            : isResolved
                            ? "bg-teal-50 text-[#168C86]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isPending
                              ? "bg-[#C98A16]"
                              : isInProgress
                              ? "bg-[#1769AA]"
                              : isResolved
                              ? "bg-[#168C86]"
                              : "bg-slate-400"
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/complaints`}
                        className="text-[11px] font-semibold text-[#1769AA] hover:underline"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
