"use client";

import React, { useState, useEffect } from "react";
import { useGetEdirAssociationsQuery } from "@/hooks/social-affairs";
import EdirCard from "./_components/edir-card";
import NewEdirForm from "./_components/new-edir-form";
import { Edir } from "@/api/social-affairs/edir";
import ImportEdirDialog from "./_components/import-edir-dialog";
import GenerateReportDialog from "./_components/generate-report-dialog";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EdirList = () => {
  const { data: edirs, isLoading, isError } = useGetEdirAssociationsQuery();
  // ... inside EdirList
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Client-side filtering
  if (isLoading) {
    return <div className="p-8">Loading Edir associations...</div>;
  }
  const filteredEdirs = (edirs || []).filter((edir: Edir) =>
    edir.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Client-side pagination
  const totalItems = filteredEdirs.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const currentEdirs = filteredEdirs.slice(startIndex, startIndex + limit);

  // ... rest of logic

  if (isError) {
    return (
      <div className="p-8 text-red-500">Error loading Edir associations.</div>
    );
  }
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Edir Associations
          </h1>
          <p className="text-muted-foreground">
            Manage traditional community associations
          </p>
        </div>

        <div className="flex flex-1 w-full md:w-auto md:max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GenerateReportDialog />
          <ImportEdirDialog />
          <NewEdirForm />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-10">Loading...</div>
        ) : currentEdirs.length > 0 ? (
          currentEdirs.map((edir: Edir) => (
            <EdirCard
              key={edir.id}
              edir={edir}
              onViewDetails={(edir) => console.log("View details", edir)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No Edir associations found.
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + limit, totalItems)} of {totalItems} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EdirList;
