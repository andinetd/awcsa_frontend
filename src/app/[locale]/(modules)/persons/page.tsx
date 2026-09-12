"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePersonSearch } from "@/hooks/persons/persons-hooks";
import { PersonSearchResult } from "@/api/persons/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  History,
} from "lucide-react";

const PAGE_SIZE = 20;

export default function PersonsSearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = usePersonSearch({
    q: q || undefined,
    page,
    limit: PAGE_SIZE,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(inputValue.trim());
    setPage(1);
  }

  function handleViewHistory(id: number) {
    router.push(`/persons/${id}`);
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-lexend flex items-center gap-2">
          <History className="w-7 h-7 text-primary" />
          Unified Support History
        </h1>
        <p className="text-slate-500 mt-1">
          Search for any registered individual across all departments and view
          their full cross-department support history.
        </p>
      </div>

      {/* Search bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Find a Person</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, City ID, Fayda ID or phone number…"
                className="pl-8 bg-slate-50/50 border-slate-200"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <Button type="submit" className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {(isLoading || isFetching) && (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Searching…
        </div>
      )}

      {data && !isLoading && (
        <>
          <div className="text-sm text-slate-500">
            {data.total} result{data.total !== 1 ? "s" : ""} found
          </div>

          <div className="space-y-3">
            {data.results.length === 0 && (
              <div className="p-8 text-center text-slate-400 border rounded-lg border-dashed">
                No persons found matching your search.
              </div>
            )}
            {data.results.map((person: PersonSearchResult) => (
              <PersonCard
                key={person.id}
                person={person}
                onViewHistory={() => handleViewHistory(person.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Page {data.page} of {data.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PersonCard({
  person,
  onViewHistory,
}: {
  person: PersonSearchResult;
  onViewHistory: () => void;
}) {
  const { profiles } = person;
  const profileTags: string[] = [];
  if (profiles.hasWomenProfile) profileTags.push("Women");
  if (profiles.hasDisabilityProfile) profileTags.push("Disability");
  if (profiles.hasElderlyProfile) profileTags.push("Elderly");

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-slate-500" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900">
              {person.firstName} {person.lastName}
            </div>
            <div className="text-sm text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
              {person.cityIdNumber && (
                <span>City ID: {person.cityIdNumber}</span>
              )}
              {person.faydaId && <span>Fayda: {person.faydaId}</span>}
              {person.phoneNumber && <span>📞 {person.phoneNumber}</span>}
              {person.subCity && (
                <span>
                  📍 {person.subCity}
                  {person.woreda ? ` / ${person.woreda}` : ""}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="secondary" className="text-xs">
                {person.clientCategory}
              </Badge>
              {profileTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {!person.activeStatus && (
                <Badge variant="destructive" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="flex-shrink-0 gap-1.5"
          onClick={onViewHistory}
        >
          <History className="w-4 h-4" />
          View History
        </Button>
      </CardContent>
    </Card>
  );
}
