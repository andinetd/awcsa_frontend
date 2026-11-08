"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetWomenAssociationsQuery } from "@/hooks/womens";
import { WomenAssociationRecord } from "@/api/womens/associations";
import { useTranslations } from "next-intl";
import { Search, Check, ChevronsUpDown, X, Landmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssociationSelectProps {
  value?: string | number;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function AssociationSelect({
  value,
  onValueChange,
  placeholder,
  className,
  disabled = false,
}: AssociationSelectProps) {
  const { data: response, isLoading } = useGetWomenAssociationsQuery();
  const t = useTranslations("women");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const associations: WomenAssociationRecord[] = useMemo(() => {
    if (!response) return [];
    return Array.isArray(response) ? response : response.data || [];
  }, [response]);

  const valueStr = value !== undefined && value !== null ? String(value) : "";

  const selectedAssociation = useMemo(() => {
    if (!valueStr || !associations.length) return null;
    return associations.find((a) => a.id.toString() === valueStr);
  }, [valueStr, associations]);

  const filteredAssociations = useMemo(() => {
    if (!associations.length) return [];
    const q = search.trim().toLowerCase();
    if (!q) return associations;

    return associations.filter((a) => {
      const name = (a.name || "").toLowerCase();
      const idStr = a.id?.toString() || "";
      const subCity = (a.subCity || "").toLowerCase();
      const woreda = (a.woreda || "").toLowerCase();
      const leaderName = (a.leaderName || "").toLowerCase();
      const leaderPhone = (a.leaderPhoneNumber || "").toLowerCase();
      const type = (a.type || "").toLowerCase();

      return (
        name.includes(q) ||
        idStr.includes(q) ||
        subCity.includes(q) ||
        woreda.includes(q) ||
        leaderName.includes(q) ||
        leaderPhone.includes(q) ||
        type.includes(q)
      );
    });
  }, [associations, search]);

  const handleSelect = (assocId: number) => {
    onValueChange(assocId.toString());
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    setSearch("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-8 px-3 text-xs text-slate-500 bg-white border border-[#E3E7EB] rounded-xs">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1769AA]" />
        <span>{t("common.loading") || "Loading..."}</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full h-8 px-3 text-xs justify-between font-normal bg-white border-[#E3E7EB] rounded-xs hover:bg-[#F7F8FA] hover:text-slate-900 focus-visible:ring-1 focus-visible:ring-[#1769AA]",
            !selectedAssociation && "text-slate-500",
            className,
          )}
        >
          <div className="flex items-center gap-2 truncate text-left mr-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            {selectedAssociation ? (
              <span className="flex items-center gap-1.5 truncate">
                <span className="font-medium text-[#0B1F3A]">
                  {selectedAssociation.name}
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs shrink-0">
                  ID: {selectedAssociation.id}
                </span>
                {selectedAssociation.subCity && (
                  <span className="font-mono text-[10px] px-1 py-0.2 bg-slate-100 text-slate-600 border border-[#E3E7EB] rounded-xs shrink-0">
                    {selectedAssociation.subCity}
                    {selectedAssociation.woreda ? ` · W.${selectedAssociation.woreda}` : ""}
                  </span>
                )}
              </span>
            ) : (
              <span className="truncate">
                {placeholder || t("support.associationSelect.placeholder") || "Search association..."}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {selectedAssociation && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e as any);
                  }
                }}
                className="rounded-xs hover:bg-slate-200/80 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                title={t("support.associationSelect.clearSelection") || "Clear"}
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[320px] sm:w-[400px] p-0 border-[#E3E7EB] rounded-xs shadow-md bg-white z-50"
      >
        {/* Search Input Bar */}
        <div className="p-2 border-b border-[#E3E7EB] bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              ref={inputRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("support.associationSelect.searchPlaceholder") || "Search by name, leader, location..."}
              className="pl-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              autoFocus
            />
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-60 overflow-y-auto p-1 divide-y divide-slate-100">
          {filteredAssociations.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              <Landmark className="h-6 w-6 mx-auto text-slate-300 mb-1" />
              <p>{t("support.associationSelect.noResults") || "No associations found"}</p>
              {search && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t("support.associationSelect.noMatch", { search })}
                </p>
              )}
            </div>
          ) : (
            filteredAssociations.map((assoc) => {
              const isSelected = valueStr === assoc.id.toString();
              return (
                <button
                  key={assoc.id}
                  type="button"
                  onClick={() => handleSelect(assoc.id)}
                  className={cn(
                    "w-full text-left p-2 rounded-xs flex items-center justify-between gap-2 hover:bg-[#E8F2FA] transition-colors cursor-pointer group",
                    isSelected && "bg-[#E8F2FA]/70 text-[#1769AA]",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0B1F3A] group-hover:text-[#1769AA] truncate">
                        {assoc.name}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 bg-white text-[#1769AA] border border-[#BCD5EA] rounded-xs shrink-0">
                        ID: {assoc.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 truncate">
                      {assoc.subCity && (
                        <span>
                          {assoc.subCity}
                          {assoc.woreda ? `, W.${assoc.woreda}` : ""}
                        </span>
                      )}
                      {assoc.leaderName && (
                        <>
                          <span>·</span>
                          <span className="truncate">Leader: {assoc.leaderName}</span>
                        </>
                      )}
                      {assoc.leaderPhoneNumber && (
                        <span className="font-mono">({assoc.leaderPhoneNumber})</span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-[#1769AA] shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2 border-t border-[#E3E7EB] bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>
            {t("support.associationSelect.count", {
              filtered: filteredAssociations.length,
              total: associations.length,
            })}
          </span>
          {selectedAssociation && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#1769AA] hover:underline cursor-pointer"
            >
              {t("support.associationSelect.clear") || "Clear"}
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
