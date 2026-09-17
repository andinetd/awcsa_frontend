"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetWomenProfilesQuery } from "@/hooks/womens";
import { WomenProfile } from "@/api/womens/women-profile";
import { useTranslations } from "next-intl";
import { Search, Check, ChevronsUpDown, X, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WomanSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function WomanSelect({
  value,
  onValueChange,
  placeholder,
  className,
  disabled = false,
}: WomanSelectProps) {
  const { data: profiles, isLoading } = useGetWomenProfilesQuery();
  const t = useTranslations("women");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedProfile = useMemo(() => {
    if (!value || !profiles) return null;
    return profiles.find(
      (p: WomenProfile) =>
        p.clientId.toString() === value || p.id.toString() === value,
    );
  }, [value, profiles]);

  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    const q = search.trim().toLowerCase();
    if (!q) return profiles;

    return profiles.filter((p: WomenProfile) => {
      const fullName = `${p.client.firstName || ""} ${p.client.lastName || ""}`.toLowerCase();
      const cityId = (p.client.cityIdNumber || "").toLowerCase();
      const phone = (p.client.phoneNumber || "").toLowerCase();
      const address = (p.client.address || "").toLowerCase();
      return (
        fullName.includes(q) ||
        cityId.includes(q) ||
        phone.includes(q) ||
        address.includes(q)
      );
    });
  }, [profiles, search]);

  const handleSelect = (clientId: number) => {
    onValueChange(clientId.toString());
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
            !selectedProfile && "text-slate-500",
            className,
          )}
        >
          <div className="flex items-center gap-2 truncate text-left mr-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            {selectedProfile ? (
              <span className="flex items-center gap-1.5 truncate">
                <span className="font-medium text-[#0B1F3A]">
                  {selectedProfile.client.firstName} {selectedProfile.client.lastName}
                </span>
                {selectedProfile.client.cityIdNumber && (
                  <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#E8F2FA] text-[#1769AA] border border-[#BCD5EA] rounded-xs shrink-0">
                    {selectedProfile.client.cityIdNumber}
                  </span>
                )}
              </span>
            ) : (
              <span className="truncate">
                {placeholder || "Search beneficiary by name or ID..."}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {selectedProfile && (
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
                title="Clear selection"
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
        className="w-[320px] sm:w-[380px] p-0 border-[#E3E7EB] rounded-xs shadow-md bg-white z-50"
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
              placeholder="Search by name, city ID, phone..."
              className="pl-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              autoFocus
            />
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-60 overflow-y-auto p-1 divide-y divide-slate-100">
          {filteredProfiles.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              <User className="h-6 w-6 mx-auto text-slate-300 mb-1" />
              <p>No beneficiaries found</p>
              {search && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  No match for &quot;{search}&quot;
                </p>
              )}
            </div>
          ) : (
            filteredProfiles.map((p: WomenProfile) => {
              const isSelected =
                value === p.clientId.toString() || value === p.id.toString();
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelect(p.clientId)}
                  className={cn(
                    "w-full text-left p-2 rounded-xs flex items-center justify-between gap-2 hover:bg-[#E8F2FA] transition-colors cursor-pointer group",
                    isSelected && "bg-[#E8F2FA]/70 text-[#1769AA]",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0B1F3A] group-hover:text-[#1769AA] truncate">
                        {p.client.firstName} {p.client.lastName}
                      </span>
                      {p.client.cityIdNumber && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 bg-white text-[#1769AA] border border-[#BCD5EA] rounded-xs shrink-0">
                          {p.client.cityIdNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 truncate">
                      {p.client.phoneNumber && (
                        <span className="font-mono">{p.client.phoneNumber}</span>
                      )}
                      {p.client.phoneNumber && p.client.address && <span>·</span>}
                      {p.client.address && (
                        <span className="truncate">{p.client.address}</span>
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
            {filteredProfiles.length} of {profiles?.length || 0} beneficiaries
          </span>
          {selectedProfile && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#1769AA] hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}