"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetEdirCouncilsQuery } from "@/hooks/social-affairs";
import { EdirCouncil, EdirLevel, EdirStatus } from "@/api/social-affairs/edir";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import CouncilCard from "./_components/council-card";
import NewCouncilForm from "./_components/new-council-form";

import Link from "next/link";
import { Home } from "lucide-react";

const LEVEL_OPTIONS: (EdirLevel | "ALL")[] = [
  "ALL",
  "WOREDA",
  "SUB_CITY",
  "CITY",
];

const STATUS_OPTIONS: (EdirStatus | "ALL")[] = [
  "ALL",
  "ACTIVE",
  "EXPIRED",
  "REVOKED",
  "CANCELLED",
];

const CouncilsPage = () => {
  const t = useTranslations("social-affairs.edir.councils");
  const router = useRouter();

  const [levelFilter, setLevelFilter] = useState<EdirLevel | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<EdirStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data: councils, isLoading, isError } = useGetEdirCouncilsQuery();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredCouncils = (councils || []).filter((council: EdirCouncil) => {
    const matchesSearch = council.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());
    const matchesLevel = levelFilter === "ALL" || council.level === levelFilter;
    const matchesStatus =
      statusFilter === "ALL" || council.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const totalItems = filteredCouncils.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentCouncils = filteredCouncils.slice(
    startIndex,
    startIndex + limit
  );

  if (isError) {
    return (
      <div className="p-8 text-center text-xs font-mono uppercase text-rose-600">
        {t("list.error")}
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
        <span className="text-[#0B1F3A] font-bold">{t("list.title")}</span>
      </div>

      {/* Header & Primary Actions */}
      <div className="border-b border-[#E3E7EB] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1769AA]" />
            <h1 className="text-xl font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
              {t("list.title")}
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">{t("list.subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="search"
              placeholder={t("list.search")}
              className="h-8 pl-8 text-xs rounded-xs border-[#E3E7EB] bg-slate-50/50 focus:bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <NewCouncilForm />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mr-1">
            Level:
          </span>
          {LEVEL_OPTIONS.map((level) => {
            const isSelected = levelFilter === level;
            return (
              <Button
                key={level}
                size="sm"
                variant="outline"
                className={`h-7 px-2.5 text-xs font-mono rounded-xs transition-colors ${
                  isSelected
                    ? "bg-[#1769AA] text-white border-[#1769AA] hover:bg-[#12568E] hover:text-white"
                    : "bg-white text-slate-600 border-[#E3E7EB] hover:bg-slate-50"
                }`}
                onClick={() => {
                  setLevelFilter(level);
                  setPage(1);
                }}
              >
                {level === "ALL" ? t("list.levels.all") : t(`level.${level}`)}
              </Button>
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
              <Button
                key={status}
                size="sm"
                variant="outline"
                className={`h-7 px-2.5 text-xs font-mono rounded-xs transition-colors ${
                  isSelected
                    ? "bg-[#1769AA] text-white border-[#1769AA] hover:bg-[#12568E] hover:text-white"
                    : "bg-white text-slate-600 border-[#E3E7EB] hover:bg-slate-50"
                }`}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
              >
                {status === "ALL"
                  ? t("list.status.all")
                  : t(`status.${status}`)}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Council Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="animate-pulse text-xs font-mono uppercase tracking-wider text-slate-400">
              {t("list.loading")}
            </div>
          </div>
        ) : currentCouncils.length > 0 ? (
          currentCouncils.map((council: EdirCouncil) => (
            <CouncilCard
              key={council.id}
              council={council}
              onViewDetails={(council) =>
                router.push(`/social-affairs/edir/councils/${council.id}`)
              }
            />
          ))
        ) : (
          <div className="col-span-full rounded-xs border border-dashed border-[#E3E7EB] bg-white p-12 text-center text-slate-400 font-mono text-xs uppercase tracking-wider">
            {t("list.noRecords")}
          </div>
        )}
      </div>

      {/* Institutional Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-[#E3E7EB] pt-4 mt-auto">
          <div className="text-xs font-mono text-slate-500">
            {t("list.pagination", {
              start: startIndex + 1,
              end: Math.min(startIndex + limit, totalItems),
              total: totalItems,
            })}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] hover:bg-slate-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("list.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] hover:bg-slate-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              {t("list.next")}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilsPage;