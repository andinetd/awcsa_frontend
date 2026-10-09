"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useCareCenterChildren } from "@/hooks/adoption/care-center/useChildren";
import { useCareCenterReports } from "@/hooks/adoption/care-center/useReports";
import {
  Loader2,
  Baby,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useAuthMeQuery } from "@/hooks/applicants-portal";
import { useAuthStore } from "@/stores/auth-store";
import { useTranslations } from "next-intl";
import { Columns } from "./_components/columns";

const CareCentersPortal = () => {
  const t = useTranslations("care-centers-portal.dashboard");
  const columns = Columns();

  const { data: me } = useAuthMeQuery();
  const entity = useAuthStore((state) => state.entity);
  const facilityId =
    entity?.id ||
    me?.facilityId ||
    me?.entity?.id ||
    (typeof me?.id === "number" ? me.id : undefined);

  const { data: children, isLoading: isChildrenLoading } =
    useCareCenterChildren(facilityId);
  const { data: reports, isLoading: isReportsLoading } = useCareCenterReports();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("ALL");

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const currentMonthReport = useMemo(() => {
    return (reports || []).find(
      (r) => r.month === currentMonth && r.year === currentYear,
    );
  }, [reports, currentMonth, currentYear]);

  const latestReport = useMemo(() => {
    if (!reports || reports.length === 0) return null;
    return [...reports].sort((a, b) => b.id - a.id)[0];
  }, [reports]);

  const filteredChildren = useMemo(() => {
    if (!children) return [];
    return children.filter((child) => {
      if (selectedGender !== "ALL") {
        if (
          (child.gender || "").toUpperCase() !== selectedGender.toUpperCase()
        ) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${child.firstName || ""} ${child.middleName || ""} ${child.lastName || ""}`.toLowerCase();
        return fullName.includes(q);
      }
      return true;
    });
  }, [children, searchQuery, selectedGender]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner / Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of facility census, children in care, and ministry compliance reporting.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/care-centers-portal/add-child">
            <Button className="gap-1.5 shadow-sm">
              <Plus className="size-4" />
              <span>{t("addChild")}</span>
            </Button>
          </Link>
          <Link href="/care-centers-portal/monthly-report">
            <Button variant="outline" className="gap-1.5">
              <FileText className="size-4" />
              <span>{t("submitMonthlyReport")}</span>
            </Button>
          </Link>
          <Link href="/care-centers-portal/reports">
            <Button variant="secondary" className="gap-1.5">
              <span>{t("viewPastReports")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Baby className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Children in Care
              </p>
              <h3 className="text-2xl font-bold tracking-tight">
                {isChildrenLoading ? "..." : children?.length ?? 0}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Current active census
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ArrowUpRight className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                New Admissions
              </p>
              <h3 className="text-2xl font-bold tracking-tight">
                {isReportsLoading
                  ? "..."
                  : latestReport?.newAdmissions ?? 0}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Latest reported month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Discharges / Exits
              </p>
              <h3 className="text-2xl font-bold tracking-tight">
                {isReportsLoading
                  ? "..."
                  : latestReport?.discharges ?? 0}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Reunited or placed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                currentMonthReport
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {currentMonthReport ? (
                <CheckCircle2 className="size-6" />
              ) : (
                <Clock className="size-6" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Monthly Report Status
              </p>
              <h3 className="text-base font-bold tracking-tight mt-0.5">
                {isReportsLoading
                  ? "Checking..."
                  : currentMonthReport
                  ? currentMonthReport.status
                  : "Pending Submission"}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {currentMonthReport ? "Submitted for current month" : "Due by end of month"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Table Section */}
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by child name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Gender:
            </span>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-32 h-9 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isChildrenLoading ? (
          <div className="flex justify-center items-center py-20 min-h-[300px] border rounded-lg bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">{t("loading")}</span>
          </div>
        ) : (
          <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-2">
            <DataTable columns={columns} data={filteredChildren} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CareCentersPortal;

