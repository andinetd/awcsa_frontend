"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { searchBeneficiaries } from "@/api/beneficiaries/beneficiaries";
import {
  createAidDistribution,
  CreateAidDistributionPayload,
} from "@/api/beneficiaries/aid-distribution";
import { Beneficiary } from "@/api/beneficiaries/types-v2";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  Check,
  Gift,
  Package,
  Users,
  DollarSign,
  X,
} from "lucide-react";

interface DistributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMonth?: string;
  defaultSubCity?: string;
  defaultWoreda?: string;
}

export function DistributionDialog({
  open,
  onOpenChange,
  defaultMonth = "ጥቅምት 2017",
  defaultSubCity = "ለሚ ኩራ",
  defaultWoreda = "",
}: DistributionDialogProps) {
  const queryClient = useQueryClient();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  // Form states
  const [distributionMonth, setDistributionMonth] = useState(defaultMonth);
  const [subCity, setSubCity] = useState(defaultSubCity);
  const [woreda, setWoreda] = useState(defaultWoreda);

  // Family count
  const [familyMaleCount, setFamilyMaleCount] = useState<number>(0);
  const [familyFemaleCount, setFamilyFemaleCount] = useState<number>(0);
  const [familyTotalCount, setFamilyTotalCount] = useState<number>(0);

  // Package items
  const [includeOil, setIncludeOil] = useState<boolean>(true);
  const [oilLiters, setOilLiters] = useState<number>(3);

  const [includeFlour, setIncludeFlour] = useState<boolean>(true);
  const [flourKg, setFlourKg] = useState<number>(10);

  const [includeOnions, setIncludeOnions] = useState<boolean>(true);
  const [onionsKg, setOnionsKg] = useState<number>(5);

  const [clothingSupport, setClothingSupport] = useState<boolean>(false);
  const [clothingDetails, setClothingDetails] = useState<string>("");

  const [includeCash, setIncludeCash] = useState<boolean>(false);
  const [cashAmount, setCashAmount] = useState<number>(0);

  const [healthInsurance, setHealthInsurance] = useState<boolean>(false);

  const [totalCashEquivalent, setTotalCashEquivalent] = useState<number>(2500);
  const [signatureTaken, setSignatureTaken] = useState<boolean>(true);
  const [remark, setRemark] = useState<string>("");

  // Sync total family count
  useEffect(() => {
    setFamilyTotalCount((Number(familyMaleCount) || 0) + (Number(familyFemaleCount) || 0));
  }, [familyMaleCount, familyFemaleCount]);

  // Beneficiary search query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["beneficiary-quick-search", searchQuery],
    queryFn: () => searchBeneficiaries({ q: searchQuery, pageSize: 6 }),
    enabled: searchQuery.trim().length >= 2 && !selectedBeneficiary,
  });

  const selectBeneficiary = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setSearchQuery(`${b.firstName} ${b.lastName} ${b.grandfatherName || ""}`.trim());
    if (b.subCity) setSubCity(b.subCity);
    if (b.woreda) setWoreda(b.woreda);

    const totalCount = b.familyMembersCount || 1;
    setFamilyTotalCount(totalCount);
    setFamilyMaleCount(Math.ceil(totalCount / 2));
    setFamilyFemaleCount(Math.floor(totalCount / 2));
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateAidDistributionPayload) => createAidDistribution(payload),
    onSuccess: () => {
      toast.success("የድጋፍ ስርጭት መረጃው በተሳካ ሁኔታ ተመዝግቧል (Distribution successfully recorded)");
      queryClient.invalidateQueries({ queryKey: ["aid-distributions"] });
      queryClient.invalidateQueries({ queryKey: ["aid-distribution-summary"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "ስርጭቱን መመዝገብ አልተቻለም";
      toast.error(msg);
    },
  });

  const resetForm = () => {
    setSelectedBeneficiary(null);
    setSearchQuery("");
    setFamilyMaleCount(0);
    setFamilyFemaleCount(0);
    setFamilyTotalCount(0);
    setIncludeOil(true);
    setOilLiters(3);
    setIncludeFlour(true);
    setFlourKg(10);
    setIncludeOnions(true);
    setOnionsKg(5);
    setClothingSupport(false);
    setClothingDetails("");
    setIncludeCash(false);
    setCashAmount(0);
    setHealthInsurance(false);
    setTotalCashEquivalent(2500);
    setSignatureTaken(true);
    setRemark("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBeneficiary) {
      toast.error("እባክዎ መጀመሪያ ተጠቃሚውን ይምረጡ (Please select a beneficiary)");
      return;
    }

    if (!distributionMonth.trim()) {
      toast.error("እባክዎ የስርጭት ወሩን ያስገቡ (Please specify distribution month)");
      return;
    }

    const payload: CreateAidDistributionPayload = {
      clientId: selectedBeneficiary.id,
      distributionMonth,
      subCity,
      woreda: woreda || selectedBeneficiary.woreda || "",
      familyMaleCount: Number(familyMaleCount) || 0,
      familyFemaleCount: Number(familyFemaleCount) || 0,
      familyTotalCount: Number(familyTotalCount) || 0,
      oilLiters: includeOil ? Number(oilLiters) || 0 : 0,
      flourKg: includeFlour ? Number(flourKg) || 0 : 0,
      onionsKg: includeOnions ? Number(onionsKg) || 0 : 0,
      clothingSupport,
      clothingDetails: clothingSupport ? clothingDetails : undefined,
      cashAmount: includeCash ? Number(cashAmount) || 0 : 0,
      healthInsuranceSponsorship: healthInsurance,
      totalCashEquivalent: Number(totalCashEquivalent) || 0,
      signatureTaken,
      remark: remark || undefined,
    };

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto rounded-xs border-[#E3E7EB] bg-white p-6 shadow-lg">
        <DialogHeader className="border-b border-[#E3E7EB] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xs bg-[#1769AA]/10 text-[#1769AA]">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold uppercase tracking-wider font-mono text-[#0B1F3A]">
                አዲስ የቤተሰብ ድጋፍ ስርጭት መዝግብ
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-mono">
                Record Aid & Rehabilitation Distribution Roster Entry
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Beneficiary Selector */}
          <div className="space-y-1.5 relative">
            <Label className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold">
              ተጠቃሚ ምረጥ (Beneficiary Search) <span className="text-rose-600">*</span>
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="በስም፣ በስልክ ቁጥር ወይም በፋይዳ መታወቂያ ይፈልጉ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedBeneficiary) setSelectedBeneficiary(null);
                }}
                className="pl-8 pr-8 h-8 text-xs bg-white border-[#E3E7EB] rounded-xs focus-visible:ring-1 focus-visible:ring-[#1769AA]"
              />
              {isSearching && (
                <Loader2 className="absolute right-2.5 top-2.5 h-3.5 w-3.5 animate-spin text-slate-400" />
              )}
            </div>

            {/* Beneficiary Autocomplete Suggestions */}
            {searchResults && searchResults.items && searchResults.items.length > 0 && !selectedBeneficiary && (
              <div className="absolute z-20 w-full bg-white border border-[#E3E7EB] rounded-xs shadow-lg overflow-hidden mt-1 max-h-52 overflow-y-auto">
                {searchResults.items.map((b: Beneficiary) => (
                  <div
                    key={b.id}
                    onClick={() => selectBeneficiary(b)}
                    className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-[#E3E7EB] last:border-b-0 text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-xs text-[#0B1F3A]">
                        {b.firstName} {b.lastName} {b.grandfatherName || ""}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        ወረዳ: {b.woreda || "—"} | ስልክ: {b.phoneNumber || "—"} | ፋይዳ: {b.faydaId || "—"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono uppercase rounded-xs ${
                        b.clientCategory === "DISABLED"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}
                    >
                      {b.clientCategory === "DISABLED" ? "አካል ጉዳተኛ" : "አረጋዊ"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Beneficiary Summary Banner */}
            {selectedBeneficiary && (
              <div className="p-3 bg-[#E8F2FA]/60 border border-[#BCD5EA] rounded-xs flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#1769AA]" />
                    <span className="font-bold text-xs text-[#0B1F3A]">
                      {selectedBeneficiary.firstName} {selectedBeneficiary.lastName} {selectedBeneficiary.grandfatherName || ""}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs border border-slate-200 bg-white text-slate-600">
                      {selectedBeneficiary.sex === "FEMALE" ? "ሴት" : "ወንድ"} · {selectedBeneficiary.age || "—"} ዓመት
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600">
                    ክፍለ ከተማ: {selectedBeneficiary.subCity || "—"} · ወረዳ: {selectedBeneficiary.woreda || "—"} · ስልክ: {selectedBeneficiary.phoneNumber || "—"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedBeneficiary(null);
                    setSearchQuery("");
                  }}
                  className="text-xs h-7 rounded-xs font-mono text-slate-500 hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  ቀይር (Change)
                </Button>
              </div>
            )}
          </div>

          {/* Month & Administrative Scope */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                የስርጭት ወር (Month) *
              </Label>
              <Input
                value={distributionMonth}
                onChange={(e) => setDistributionMonth(e.target.value)}
                placeholder="ለምሳሌ፡ ጥቅምት 2017"
                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                ክፍለ ከተማ (Sub-City)
              </Label>
              <Input
                value={subCity}
                onChange={(e) => setSubCity(e.target.value)}
                placeholder="ለሚ ኩራ"
                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                ወረዳ (Woreda)
              </Label>
              <Input
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
                placeholder="ወረዳ 02"
                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono"
              />
            </div>
          </div>

          {/* Disaggregated Family Members */}
          <div className="border border-[#E3E7EB] rounded-xs p-3.5 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center gap-1.5 pb-1 border-b border-[#E3E7EB]">
              <Users className="w-3.5 h-3.5 text-[#1769AA]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1F3A] font-bold">
                የቤተሰብ ብዛት ጥቅል (Family Composition)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-mono text-slate-500">ወንድ (Male)</Label>
                <Input
                  type="number"
                  min="0"
                  value={familyMaleCount}
                  onChange={(e) => setFamilyMaleCount(Number(e.target.value))}
                  className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-mono text-slate-500">ሴት (Female)</Label>
                <Input
                  type="number"
                  min="0"
                  value={familyFemaleCount}
                  onChange={(e) => setFamilyFemaleCount(Number(e.target.value))}
                  className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-mono font-bold text-[#0B1F3A]">ድምር (Total)</Label>
                <Input
                  type="number"
                  min="0"
                  value={familyTotalCount}
                  onChange={(e) => setFamilyTotalCount(Number(e.target.value))}
                  className="h-8 text-xs bg-slate-100 border-[#E3E7EB] rounded-xs font-mono font-bold text-[#0B1F3A]"
                />
              </div>
            </div>
          </div>

          {/* Standard Aid Package Checklist */}
          <div className="border border-[#E3E7EB] rounded-xs p-3.5 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#E3E7EB]">
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1F3A] font-bold">
                  የድጋፉ ዓይነት (Aid Package Items)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs tracking-wider uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                መደበኛ ጥቅል (Standard Package)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* Cooking Oil */}
              <div className="p-2.5 border border-[#E3E7EB] rounded-xs bg-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-oil"
                    checked={includeOil}
                    onCheckedChange={(c) => setIncludeOil(!!c)}
                  />
                  <Label htmlFor="chk-oil" className="text-xs font-semibold cursor-pointer text-[#0B1F3A]">
                    ዘይት (Cooking Oil)
                  </Label>
                </div>
                {includeOil && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={oilLiters}
                      onChange={(e) => setOilLiters(Number(e.target.value))}
                      className="h-7 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono font-bold"
                    />
                    <span className="text-[11px] font-mono text-slate-500">ሊትር</span>
                  </div>
                )}
              </div>

              {/* Flour */}
              <div className="p-2.5 border border-[#E3E7EB] rounded-xs bg-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-flour"
                    checked={includeFlour}
                    onCheckedChange={(c) => setIncludeFlour(!!c)}
                  />
                  <Label htmlFor="chk-flour" className="text-xs font-semibold cursor-pointer text-[#0B1F3A]">
                    ዱቄት (Flour)
                  </Label>
                </div>
                {includeFlour && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      value={flourKg}
                      onChange={(e) => setFlourKg(Number(e.target.value))}
                      className="h-7 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono font-bold"
                    />
                    <span className="text-[11px] font-mono text-slate-500">ኪሎ</span>
                  </div>
                )}
              </div>

              {/* Onions */}
              <div className="p-2.5 border border-[#E3E7EB] rounded-xs bg-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-onions"
                    checked={includeOnions}
                    onCheckedChange={(c) => setIncludeOnions(!!c)}
                  />
                  <Label htmlFor="chk-onions" className="text-xs font-semibold cursor-pointer text-[#0B1F3A]">
                    ሽንኩርት (Onions)
                  </Label>
                </div>
                {includeOnions && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={onionsKg}
                      onChange={(e) => setOnionsKg(Number(e.target.value))}
                      className="h-7 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono font-bold"
                    />
                    <span className="text-[11px] font-mono text-slate-500">ኪሎ</span>
                  </div>
                )}
              </div>

              {/* Clothing */}
              <div className="p-2.5 border border-[#E3E7EB] rounded-xs bg-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-clothing"
                    checked={clothingSupport}
                    onCheckedChange={(c) => setClothingSupport(!!c)}
                  />
                  <Label htmlFor="chk-clothing" className="text-xs font-semibold cursor-pointer text-[#0B1F3A]">
                    አልባሳት (Clothing)
                  </Label>
                </div>
                {clothingSupport && (
                  <Input
                    placeholder="የአልባሳት ዝርዝር..."
                    value={clothingDetails}
                    onChange={(e) => setClothingDetails(e.target.value)}
                    className="h-7 text-xs bg-white border-[#E3E7EB] rounded-xs mt-1"
                  />
                )}
              </div>

              {/* Cash Support */}
              <div className="p-2.5 border border-[#E3E7EB] rounded-xs bg-white space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-cash"
                    checked={includeCash}
                    onCheckedChange={(c) => setIncludeCash(!!c)}
                  />
                  <Label htmlFor="chk-cash" className="text-xs font-semibold cursor-pointer text-[#0B1F3A]">
                    የጥሬ ገንዘብ (Cash)
                  </Label>
                </div>
                {includeCash && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Input
                      type="number"
                      min="0"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(Number(e.target.value))}
                      className="h-7 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono font-bold"
                    />
                    <span className="text-[11px] font-mono text-slate-500">ብር</span>
                  </div>
                )}
              </div>

              {/* Sponsored Health Insurance */}
              <div className="p-2.5 border border-[#E3E7EB] rounded-xs bg-white flex flex-col justify-center space-y-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-insurance"
                    checked={healthInsurance}
                    onCheckedChange={(c) => setHealthInsurance(!!c)}
                  />
                  <Label htmlFor="chk-insurance" className="text-xs font-semibold cursor-pointer text-[#0B1F3A]">
                    ጤና መድን (በስፖንሰርሽፕ)
                  </Label>
                </div>
                <span className="text-[10px] font-mono text-slate-500 pl-6">
                  CBHI Insurance Coverage
                </span>
              </div>
            </div>
          </div>

          {/* Valuation & Attestation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                ወደ ገንዘብ ሲቀየር (Converted Cash Value) *
              </Label>
              <Input
                type="number"
                min="0"
                step="50"
                value={totalCashEquivalent}
                onChange={(e) => setTotalCashEquivalent(Number(e.target.value))}
                className="h-8 text-xs bg-white border-[#E3E7EB] rounded-xs font-mono font-bold text-amber-700"
              />
              <p className="text-[10px] font-mono text-slate-400">
                የምግብ እና የሌሎች ድጋፎች ጥቅል የገበያ ዋጋ ግምት (ETB)
              </p>
            </div>

            <div className="space-y-1 flex flex-col justify-end">
              <div className="flex items-center gap-2 p-2 border border-[#E3E7EB] rounded-xs bg-white h-8">
                <Checkbox
                  id="chk-signature"
                  checked={signatureTaken}
                  onCheckedChange={(c) => setSignatureTaken(!!c)}
                />
                <Label htmlFor="chk-signature" className="text-xs font-mono text-slate-700 cursor-pointer">
                  የተጠቃሚው/ዋ ፊርማ ተወስዷል (Signature Taken)
                </Label>
              </div>
            </div>
          </div>

          {/* Remark */}
          <div className="space-y-1">
            <Label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              ተጨማሪ ማስታወሻ / አስተያየት (Remark)
            </Label>
            <Textarea
              rows={2}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="ተጨማሪ መግለጫ..."
              className="text-xs bg-white border-[#E3E7EB] rounded-xs"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-[#E3E7EB] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-slate-50"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              ተመለስ (Cancel)
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !selectedBeneficiary}
              className="h-8 text-xs font-mono uppercase tracking-wider rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white shadow-2xs"
            >
              {createMutation.isPending && (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              ስርጭቱን መዝግብ (Save Record)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
