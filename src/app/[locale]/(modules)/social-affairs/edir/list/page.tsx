"use client";

import React, { useState, useEffect } from "react";
import { useGetEdirAssociationsQuery } from "@/hooks/social-affairs";
import EdirCard from "./_components/edir-card";
import NewEdirForm from "./_components/new-edir-form";
import { Edir, EdirStatus } from "@/api/social-affairs/edir";
import ImportEdirDialog from "./_components/import-edir-dialog";
import GenerateReportDialog from "./_components/generate-report-dialog";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

import Link from "next/link";

const STATUS_OPTIONS: (EdirStatus | "ALL")[] = [
  "ALL",
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
  "CANCELLED",
];

const LEVEL_OPTIONS = ["ALL", "WOREDA", "SUB_CITY", "CITY"] as const;

const EdirList = () => {
  const t = useTranslations("social-affairs.edir.list");
  const { data: edirs, isLoading, isError } = useGetEdirAssociationsQuery();
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EdirStatus | "ALL">("ALL");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Client-side filtering
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
          {t("loading")}
        </div>
      </div>
    );
  }
  const filteredEdirs = (edirs || []).filter((edir: Edir) => {
    const matchesSearch = edir.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || edir.status === statusFilter;
    const matchesLevel =
      levelFilter === "ALL" || edir.registerLevel === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Client-side pagination
  const totalItems = filteredEdirs.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentEdirs = filteredEdirs.slice(startIndex, startIndex + limit);

  if (isError) {
    return (
      <div className="p-8 text-center text-xs font-mono uppercase text-rose-600">
        {t("error")}
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Municipal Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link href="/" className="hover:text-[#1769AA] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-600">Social Affairs</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B1F3A] font-bold">Edir Associations</span>
      </div>

      {/* Page Header */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
            {t("title")}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">{t("subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="search"
              placeholder={t("search")}
              className="h-8 pl-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <GenerateReportDialog />
            <ImportEdirDialog />
            <NewEdirForm />
          </div>
        </div>
      </div>

      {/* Level & Status Filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-1">
            Level:
          </span>
          {LEVEL_OPTIONS.map((level) => {
            const isSelected = levelFilter === level;
            return (
              <button
                key={level}
                onClick={() => {
                  setLevelFilter(level);
                  setPage(1);
                }}
                className={`h-7 px-2.5 rounded-xs text-xs font-mono font-medium border transition-colors ${
                  isSelected
                    ? "bg-[#1769AA] text-white border-[#1769AA] shadow-2xs"
                    : "bg-white text-slate-700 border-[#E3E7EB] hover:bg-[#F7F8FA]"
                }`}
              >
                {level === "ALL" ? t("levels.all") : t(`levels.${level}`)}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-1">
            Status:
          </span>
          {STATUS_OPTIONS.map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`h-7 px-2.5 rounded-xs text-xs font-mono font-medium border transition-colors ${
                  isSelected
                    ? "bg-[#1769AA] text-white border-[#1769AA] shadow-2xs"
                    : "bg-white text-slate-700 border-[#E3E7EB] hover:bg-[#F7F8FA]"
                }`}
              >
                {status === "ALL" ? t("status.all") : t(`status.${status}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Associations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEdirs.length > 0 ? (
          currentEdirs.map((edir: Edir) => (
            <EdirCard
              key={edir.id}
              edir={edir}
              onViewDetails={(edir) => console.log("View details", edir)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-xs font-mono text-slate-500 py-12 border border-dashed border-[#E3E7EB] rounded-xs bg-slate-50/50">
            {t("noRecords")}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-[#E3E7EB] pt-4 mt-auto">
          <div className="text-xs font-mono text-slate-500">
            {t("pagination", {
              start: startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA]"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA]"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              {t("next")}
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EdirList;
