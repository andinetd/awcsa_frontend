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
    return <div className="p-8 text-red-500">{t("list.error")}</div>;
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">
              {t("list.title")}
            </h1>
          </div>
          <p className="text-muted-foreground">{t("list.subtitle")}</p>
        </div>

        <div className="flex flex-1 w-full md:w-auto items-center gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("list.search")}
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <NewCouncilForm />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {LEVEL_OPTIONS.map((level) => (
          <Button
            key={level}
            size="sm"
            variant={levelFilter === level ? "default" : "outline"}
            onClick={() => {
              setLevelFilter(level);
              setPage(1);
            }}
          >
            {level === "ALL" ? t("list.levels.all") : t(`level.${level}`)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-2">
        {STATUS_OPTIONS.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
          >
            {status === "ALL"
              ? t("list.status.all")
              : t(`status.${status}`)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 flex-1">
        {isLoading ? (
          <div className="col-span-full text-center py-10">
            {t("list.loading")}
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
          <div className="col-span-full text-center text-gray-500 py-10">
            {t("list.noRecords")}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t pt-4 mt-auto">
          <div className="text-sm text-muted-foreground">
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              {t("list.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              {t("list.next")}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilsPage;