"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { searchBeneficiaries } from "@/api/beneficiaries/beneficiaries";
import { createAidDistribution, CreateAidDistributionPayload } from "@/api/beneficiaries/aid-distribution";
import { Beneficiary } from "@/api/beneficiaries/types-v2";
import { toast } from "sonner";
import { Loader2, Search, Check, Gift, Package, Users, DollarSign } from "lucide-react";

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
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-primary">
            <Gift className="h-5 w-5 text-primary" />
            አዲስ የቤተሰብ ድጋፍ ስርጭት መዝግብ (Record Aid Distribution)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* Beneficiary Selector */}
          <div className="space-y-2 relative">
            <Label className="font-semibold text-sm">
              ተጠቃሚ ፈልግ እና ምረጥ (Select Beneficiary) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="በስም፣ በስልክ ቁጥር ወይም በፋይዳ መታወቂያ ይፈልጉ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedBeneficiary) setSelectedBeneficiary(null);
                }}
                className="pl-9"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Beneficiary Autocomplete Suggestions */}
            {searchResults && searchResults.items && searchResults.items.length > 0 && !selectedBeneficiary && (
              <div className="absolute z-20 w-full bg-popover border rounded-md shadow-lg overflow-hidden mt-1 max-h-56 overflow-y-auto">
                {searchResults.items.map((b: Beneficiary) => (
                  <div
                    key={b.id}
                    onClick={() => selectBeneficiary(b)}
                    className="p-2.5 hover:bg-accent cursor-pointer flex items-center justify-between border-b last:border-b-0 text-xs"
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {b.firstName} {b.lastName} {b.grandfatherName || ""}
                      </p>
                      <p className="text-muted-foreground">
                        ወረዳ: {b.woreda || "—"} | ስልክ: {b.phoneNumber || "—"} | ፋይዳ: {b.faydaId || "—"}
                      </p>
                    </div>
                    <Badge variant={b.clientCategory === "DISABLED" ? "secondary" : "outline"}>
                      {b.clientCategory === "DISABLED" ? "አካል ጉዳተኛ" : "አረጋዊ"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Beneficiary Summary Banner */}
            {selectedBeneficiary && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm text-primary">
                      {selectedBeneficiary.firstName} {selectedBeneficiary.lastName} {selectedBeneficiary.grandfatherName || ""}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {selectedBeneficiary.sex === "FEMALE" ? "ሴት" : "ወንድ"} | {selectedBeneficiary.age || "—"} ዓመት
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-0.5">
                    ክፍለ ከተማ: {selectedBeneficiary.subCity || "—"} | ወረዳ: {selectedBeneficiary.woreda || "—"} | ስልክ: {selectedBeneficiary.phoneNumber || "—"}
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
                  className="text-xs h-7 text-muted-foreground hover:text-destructive"
                >
                  ቀይር (Change)
                </Button>
              </div>
            )}
          </div>

          {/* Month & Administrative Scope */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">የስርጭት ወር (Distribution Month) *</Label>
              <Input
                value={distributionMonth}
                onChange={(e) => setDistributionMonth(e.target.value)}
                placeholder="ለምሳሌ፡ ጥቅምት 2017"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">ክፍለ ከተማ (Sub-City)</Label>
              <Input
                value={subCity}
                onChange={(e) => setSubCity(e.target.value)}
                placeholder="ለሚ ኩራ"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">ወረዳ (Woreda)</Label>
              <Input
                value={woreda}
                onChange={(e) => setWoreda(e.target.value)}
                placeholder="ወረዳ 02"
              />
            </div>
          </div>

          {/* Disaggregated Family Members */}
          <div className="border rounded-lg p-3.5 bg-card space-y-2.5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <Label className="font-semibold text-sm">የቤተሰብ ብዛት ጥቅል (Family Composition)</Label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">ወንድ (Male)</Label>
                <Input
                  type="number"
                  min="0"
                  value={familyMaleCount}
                  onChange={(e) => setFamilyMaleCount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">ሴት (Female)</Label>
                <Input
                  type="number"
                  min="0"
                  value={familyFemaleCount}
                  onChange={(e) => setFamilyFemaleCount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-foreground">ድምር (Total)</Label>
                <Input
                  type="number"
                  min="0"
                  value={familyTotalCount}
                  onChange={(e) => setFamilyTotalCount(Number(e.target.value))}
                  className="font-bold bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Standard Aid Package Checklist */}
          <div className="border rounded-lg p-3.5 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-600" />
                <Label className="font-semibold text-sm">የድጋፉ ዓይነት (Aid Package Items)</Label>
              </div>
              <Badge variant="outline" className="text-xs">መደበኛ ጥቅል (Standard Municipal Package)</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Cooking Oil */}
              <div className="flex flex-col gap-1.5 p-2.5 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-oil"
                    checked={includeOil}
                    onCheckedChange={(c) => setIncludeOil(!!c)}
                  />
                  <Label htmlFor="chk-oil" className="text-xs font-bold cursor-pointer">
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
                      className="h-8 text-xs font-semibold"
                    />
                    <span className="text-xs text-muted-foreground">ሊትር</span>
                  </div>
                )}
              </div>

              {/* Flour */}
              <div className="flex flex-col gap-1.5 p-2.5 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-flour"
                    checked={includeFlour}
                    onCheckedChange={(c) => setIncludeFlour(!!c)}
                  />
                  <Label htmlFor="chk-flour" className="text-xs font-bold cursor-pointer">
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
                      className="h-8 text-xs font-semibold"
                    />
                    <span className="text-xs text-muted-foreground">ኪሎ</span>
                  </div>
                )}
              </div>

              {/* Onions */}
              <div className="flex flex-col gap-1.5 p-2.5 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-onions"
                    checked={includeOnions}
                    onCheckedChange={(c) => setIncludeOnions(!!c)}
                  />
                  <Label htmlFor="chk-onions" className="text-xs font-bold cursor-pointer">
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
                      className="h-8 text-xs font-semibold"
                    />
                    <span className="text-xs text-muted-foreground">ኪሎ</span>
                  </div>
                )}
              </div>

              {/* Clothing */}
              <div className="flex flex-col gap-1.5 p-2.5 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-clothing"
                    checked={clothingSupport}
                    onCheckedChange={(c) => setClothingSupport(!!c)}
                  />
                  <Label htmlFor="chk-clothing" className="text-xs font-bold cursor-pointer">
                    አልባሳት (Clothing)
                  </Label>
                </div>
                {clothingSupport && (
                  <Input
                    placeholder="የአልባሳት ዝርዝር..."
                    value={clothingDetails}
                    onChange={(e) => setClothingDetails(e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                )}
              </div>

              {/* Cash Support */}
              <div className="flex flex-col gap-1.5 p-2.5 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-cash"
                    checked={includeCash}
                    onCheckedChange={(c) => setIncludeCash(!!c)}
                  />
                  <Label htmlFor="chk-cash" className="text-xs font-bold cursor-pointer">
                    የጥሬ ገንዘብ ድጋፍ (Cash)
                  </Label>
                </div>
                {includeCash && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Input
                      type="number"
                      min="0"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(Number(e.target.value))}
                      className="h-8 text-xs font-semibold"
                    />
                    <span className="text-xs text-muted-foreground">ብር</span>
                  </div>
                )}
              </div>

              {/* Sponsored Health Insurance */}
              <div className="flex flex-col justify-center p-2.5 border rounded-md bg-muted/20">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chk-insurance"
                    checked={healthInsurance}
                    onCheckedChange={(c) => setHealthInsurance(!!c)}
                  />
                  <Label htmlFor="chk-insurance" className="text-xs font-bold cursor-pointer">
                    ጤና መድን (በስፖንሰርሽፕ)
                  </Label>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 ml-6">
                  Community Based Health Insurance
                </span>
              </div>
            </div>
          </div>

          {/* Valuation & Attestation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-amber-600" />
                ወደ ገንዘብ ሲቀየር (Converted Cash Value in ETB) *
              </Label>
              <Input
                type="number"
                min="0"
                step="50"
                value={totalCashEquivalent}
                onChange={(e) => setTotalCashEquivalent(Number(e.target.value))}
                className="font-bold text-amber-700 dark:text-amber-400"
              />
              <p className="text-[11px] text-muted-foreground">
                የምግብ እና የሌሎች ድጋፎች ጥቅል የገበያ ዋጋ ግምት
              </p>
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <div className="flex items-center gap-2 p-2.5 border rounded-md bg-muted/30">
                <Checkbox
                  id="chk-signature"
                  checked={signatureTaken}
                  onCheckedChange={(c) => setSignatureTaken(!!c)}
                />
                <Label htmlFor="chk-signature" className="text-xs font-semibold cursor-pointer">
                  የተጠቃሚው/ዋ ፊርማ ተወስዷል (Recipient Signature Collected)
                </Label>
              </div>
            </div>
          </div>

          {/* Remark */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">ተጨማሪ ማስታወሻ / አስተያየት (Remark)</Label>
            <Textarea
              rows={2}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="ተጨማሪ መግለጫ..."
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              ተመለስ (Cancel)
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !selectedBeneficiary}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ስርጭቱን መዝግብ (Save Distribution)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
