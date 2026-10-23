"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAidDistributions,
  getAidDistributionSummary,
  deleteAidDistribution,
  AidDistribution,
} from "@/api/beneficiaries/aid-distribution";
import { DistributionDialog } from "./_components/distribution-dialog";
import { printAidDistributionRoster } from "@/lib/pdf/print-aid-distribution-roster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Gift,
  Plus,
  Printer,
  Search,
  Filter,
  Users,
  Package,
  DollarSign,
  HeartHandshake,
  MoreVertical,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function AidDistributionPage() {
  const queryClient = useQueryClient();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filters state
  const [monthFilter, setMonthFilter] = useState("ጥቅምት 2017");
  const [woredaFilter, setWoredaFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 25;

  // Fetch distributions
  const {
    data: listResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["aid-distributions", monthFilter, woredaFilter, searchFilter, page],
    queryFn: () =>
      listAidDistributions({
        distributionMonth: monthFilter || undefined,
        woreda: woredaFilter || undefined,
        search: searchFilter || undefined,
        page,
        limit,
      }),
  });

  // Fetch summary
  const { data: summary } = useQuery({
    queryKey: ["aid-distribution-summary", monthFilter, woredaFilter],
    queryFn: () =>
      getAidDistributionSummary({
        distributionMonth: monthFilter || undefined,
        woreda: woredaFilter || undefined,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAidDistribution(id),
    onSuccess: () => {
      toast.success("የስርጭት መረጃው ተሰርዟል (Record deleted)");
      queryClient.invalidateQueries({ queryKey: ["aid-distributions"] });
      queryClient.invalidateQueries({ queryKey: ["aid-distribution-summary"] });
    },
    onError: () => {
      toast.error("መረጃውን መሰረዝ አልተቻለም (Failed to delete record)");
    },
  });

  const handlePrintRoster = () => {
    if (!listResponse?.data || listResponse.data.length === 0) {
      toast.error("ለማተም የሚያስችል የስርጭት መረጃ አልተገኘም (No distribution records found to print)");
      return;
    }

    printAidDistributionRoster({
      distributions: listResponse.data,
      distributionMonth: monthFilter,
      woreda: woredaFilter,
    });
  };

  const distributions = listResponse?.data || [];
  const totalPages = listResponse?.totalPages || 1;

  return (
    <div className="space-y-6 p-1 md:p-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                የቤተሰብ ድጋፍና ተሃድሶ ስርጭት ጥቅል መረጃ
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                የአካል ጉዳተኞች፣ የአረጋውያን እና ቤተሰብ ጉዳይ ማስተባበርያና መከታተያ ቡድን የወር ጥቅል ድጋፍ መዝገብ
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handlePrintRoster}
            className="flex items-center gap-1.5 shadow-sm text-xs font-semibold"
          >
            <Printer className="h-4 w-4 text-primary" />
            የወር ጥቅል ሪፖርት አትም (Print Roster)
          </Button>

          <Button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 shadow text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            አዲስ ስርጭት መዝግብ (Record Distribution)
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Families */}
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              ተጠቃሚ ቤተሰቦች (Families)
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalRecords?.toLocaleString() ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              በተመረጠው ወር የተደገፉ አባወራዎች
            </p>
          </CardContent>
        </Card>

        {/* Beneficiary Members Breakdown */}
        <Card className="border-l-4 border-l-purple-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              የቤተሰብ አባላት (Members)
            </CardTitle>
            <HeartHandshake className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalFamilyMembers?.toLocaleString() ?? 0}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground font-medium">
              <span>ወንድ: <strong className="text-foreground">{summary?.totalFamilyMale ?? 0}</strong></span>
              <span>•</span>
              <span>ሴት: <strong className="text-foreground">{summary?.totalFamilyFemale ?? 0}</strong></span>
            </div>
          </CardContent>
        </Card>

        {/* Package Commodities */}
        <Card className="border-l-4 border-l-emerald-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              የምግብ ጥቅል ድጋፍ (Food Items)
            </CardTitle>
            <Package className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((summary?.totalOilLiters ?? 0) > 0 ? `${summary?.totalOilLiters}L ዘይት` : "የተከፋፈለ")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              ዱቄት: {summary?.totalFlourKg ?? 0} ኪ | ሽንኩርት: {summary?.totalOnionsKg ?? 0} ኪ
            </p>
          </CardContent>
        </Card>

        {/* Converted Cash Value */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              ወደ ገንዘብ ሲቀየር (Total Value)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {(summary?.totalCashEquivalent ?? 0).toLocaleString()} <span className="text-sm font-normal text-foreground">ብር</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              የጥሬ ገንዘብ ድጋፍ: {(summary?.totalCashAmount ?? 0).toLocaleString()} ብር
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="በተጠቃሚ ስም / ስልክ / ፋይዳ..."
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setPage(1);
                }}
                className="pl-9 text-xs"
              />
            </div>

            {/* Month Filter */}
            <div className="relative">
              <Input
                placeholder="የስርጭት ወር (ለምሳሌ፡ ጥቅምት 2017)"
                value={monthFilter}
                onChange={(e) => {
                  setMonthFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs"
              />
            </div>

            {/* Woreda Filter */}
            <div>
              <Input
                placeholder="ወረዳ አጣራ (Filter Woreda)"
                value={woredaFilter}
                onChange={(e) => {
                  setWoredaFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMonthFilter("");
                  setWoredaFilter("");
                  setSearchFilter("");
                  setPage(1);
                }}
                className="text-xs w-full"
              >
                አጣራውን አጽዳ (Clear)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-12 text-center text-xs">ተ.ቁ</TableHead>
                <TableHead className="text-xs font-bold">የተጠቃሚው/ዋ ሙሉ ስም</TableHead>
                <TableHead className="text-center text-xs">ፆታ</TableHead>
                <TableHead className="text-center text-xs">እድሜ</TableHead>
                <TableHead className="text-center text-xs">ወረዳ</TableHead>
                <TableHead className="text-center text-xs">
                  የቤተሰብ ብዛት
                  <span className="block text-[10px] font-normal text-muted-foreground">(ወ / ሴ / ድምር)</span>
                </TableHead>
                <TableHead className="text-xs font-bold">የድጋፉ ዓይነት (Package Items)</TableHead>
                <TableHead className="text-center text-xs">ስልክ ቁጥር</TableHead>
                <TableHead className="text-right text-xs font-bold">ወደ ገንዘብ ሲቀየር</TableHead>
                <TableHead className="text-center text-xs">ፊርማ</TableHead>
                <TableHead className="w-10 text-center text-xs"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-40 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-2 block">
                      መረጃ በመጫን ላይ ነው...
                    </span>
                  </TableCell>
                </TableRow>
              ) : distributions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-32 text-center text-muted-foreground text-xs">
                    ምንም የተመዘገበ የድጋፍ ስርጭት መረጃ አልተገኘም (No distribution records found).
                  </TableCell>
                </TableRow>
              ) : (
                distributions.map((item, index) => {
                  const fullName = item.client
                    ? `${item.client.firstName} ${item.client.lastName} ${item.client.grandfatherName || ""}`.trim()
                    : "—";
                  const sexLabel = item.client?.sex === "FEMALE" ? "ሴት" : item.client?.sex === "MALE" ? "ወንድ" : "—";

                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-xs font-mono">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        <div>{fullName}</div>
                        <div className="text-[11px] text-muted-foreground font-normal">
                          {item.client?.clientCategory === "DISABILITY" ? "አካል ጉዳተኛ" : "አረጋዊ"}
                          {item.client?.faydaId ? ` • ፋይዳ: ${item.client.faydaId}` : ""}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs">{sexLabel}</TableCell>
                      <TableCell className="text-center text-xs">{item.client?.age ?? "—"}</TableCell>
                      <TableCell className="text-center text-xs font-medium">
                        {item.woreda || item.client?.woreda || "—"}
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono">
                        <span className="text-blue-600 font-bold">{item.familyMaleCount}</span>
                        <span className="text-muted-foreground"> / </span>
                        <span className="text-pink-600 font-bold">{item.familyFemaleCount}</span>
                        <span className="text-muted-foreground"> / </span>
                        <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">
                          {item.familyTotalCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {item.oilLiters > 0 && (
                            <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200">
                              ዘይት {item.oilLiters}L
                            </Badge>
                          )}
                          {item.flourKg > 0 && (
                            <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-800 border-slate-200">
                              ዱቄት {item.flourKg}Kg
                            </Badge>
                          )}
                          {item.onionsKg > 0 && (
                            <Badge variant="secondary" className="text-[10px] bg-red-50 text-red-800 border-red-200">
                              ሽንኩርት {item.onionsKg}Kg
                            </Badge>
                          )}
                          {item.clothingSupport && (
                            <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200">
                              አልባሳት
                            </Badge>
                          )}
                          {item.cashAmount > 0 && (
                            <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                              ጥሬ ገንዘብ: {item.cashAmount} ብር
                            </Badge>
                          )}
                          {item.healthInsuranceSponsorship && (
                            <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-800 border-purple-200">
                              ጤና መድን
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs font-mono">
                        {item.client?.phoneNumber || "—"}
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold text-amber-700 dark:text-amber-400">
                        {item.totalCashEquivalent ? `${item.totalCashEquivalent.toLocaleString()} ብር` : "—"}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {item.signatureTaken ? (
                          <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300">
                            የተፈረመ ✓
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">ያልተፈረመ</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm("እርግጠኛ ነዎት ይህንን የስርጭት መረጃ መሰረዝ ይፈልጋሉ?")) {
                                  deleteMutation.mutate(item.id);
                                }
                              }}
                              className="text-destructive text-xs flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              መረጃውን ሰርዝ (Delete)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t text-xs text-muted-foreground">
            <div>
              ገጽ {page} ከ {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Registration Dialog */}
      <DistributionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultMonth={monthFilter}
        defaultWoreda={woredaFilter}
      />
    </div>
  );
}
