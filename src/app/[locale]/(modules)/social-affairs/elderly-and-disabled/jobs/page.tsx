"use client";

import React, { useState } from "react";
import { useGetJobsQuery } from "@/hooks/beneficiaries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, Briefcase, FileDown } from "lucide-react";
import BeneficiaryReportDialog from "../_components/report-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/custom/custom-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import JobForm from "../_components/job-form";

export default function JobsPage() {
  const { data: jobs, isLoading } = useGetJobsQuery();
  const [search, setSearch] = useState("");

  const filteredData =
    jobs?.filter(
      (item: any) =>
        item.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        item.companyIdNumber.toLowerCase().includes(search.toLowerCase()) ||
        `${item.client?.firstName} ${item.client?.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
    ) || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-lexend">
            Job Placements
          </h1>
          <p className="text-slate-500 mt-1">
            Track employment and livelihood support for beneficiaries.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <JobForm />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Global Job Placements
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search position or company ID..."
                className="pl-8 bg-slate-50/50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="text-slate-500">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold">Beneficiary</TableHead>
                  <TableHead className="font-semibold">Company ID</TableHead>
                  <TableHead className="font-semibold">Position</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      Loading placements...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((j: any) => (
                    <TableRow
                      key={j.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {j.client?.firstName} {j.client?.lastName}
                        <p className="text-xs text-slate-400">
                          {j.client?.cityIdNumber}
                        </p>
                      </TableCell>
                      <TableCell>{j.companyIdNumber}</TableCell>
                      <TableCell>{j.jobTitle}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(j.startDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-10 text-slate-400"
                    >
                      No job placements found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
