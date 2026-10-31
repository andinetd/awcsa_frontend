"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDragAndDrop } from "@/components/custom/file-dropzone";
import {
  useImportEdirAssociationsMutation,
  usePreviewEdirImportMutation,
} from "@/hooks/social-affairs";
import {
  ImportWorkbookResult,
  ParsedEdirRecord,
  ParsedContributionRecord,
  ParsedBeneficiaryRecord,
} from "@/api/social-affairs/importEdirAssociations";
import { toast } from "sonner";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Building2,
  HeartHandshake,
  Users,
  Loader2,
  Coins,
  Copy,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ImportEdirDialog() {
  const t = useTranslations("social-affairs.edir.edir.import");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [previewData, setPreviewData] = useState<ImportWorkbookResult | null>(null);
  const [filterIssuesOnly, setFilterIssuesOnly] = useState<boolean>(false);

  const { mutate: previewMutate, isPending: isPreviewing } = usePreviewEdirImportMutation();
  const { mutate: importMutate, isPending: isImporting } = useImportEdirAssociationsMutation();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep("upload");
      setFiles([]);
      setPreviewData(null);
      setFilterIssuesOnly(false);
    }
  };

  const handlePreview = () => {
    if (files.length === 0) return;

    previewMutate(files[0], {
      onSuccess: (data) => {
        setPreviewData(data);
        setStep("preview");
      },
      onError: (error: any) => {
        toast.error(error.message || t("error"));
        console.error("Preview error:", error);
      },
    });
  };

  const handleImport = () => {
    if (files.length === 0) return;

    importMutate(files[0], {
      onSuccess: () => {
        toast.success(t("success"));
        handleOpenChange(false);
      },
      onError: (error: any) => {
        toast.error(error.message || t("error"));
        console.error("Import error:", error);
      },
    });
  };

  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined || isNaN(val)) return "-";
    return `${Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ETB`;
  };

  const hasRecordIssue = (row: { isDuplicate?: boolean; issues?: any[] }) => {
    return Boolean(row.isDuplicate || (row.issues && row.issues.length > 0));
  };

  const displayedEdirs = previewData?.parsedEdirs
    ? filterIssuesOnly
      ? previewData.parsedEdirs.filter(hasRecordIssue)
      : previewData.parsedEdirs
    : [];

  const displayedContributions = previewData?.parsedContributions
    ? filterIssuesOnly
      ? previewData.parsedContributions.filter(hasRecordIssue)
      : previewData.parsedContributions
    : [];

  const displayedBeneficiaries = previewData?.parsedBeneficiaries
    ? filterIssuesOnly
      ? previewData.parsedBeneficiaries.filter(hasRecordIssue)
      : previewData.parsedBeneficiaries
    : [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 text-xs font-semibold rounded-xs border-[#E3E7EB] hover:bg-[#F7F8FA] shadow-2xs gap-1.5"
        >
          <Upload className="w-3.5 h-3.5 text-[#1769AA]" />
          {t("buttons.import")}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={
          step === "upload"
            ? "sm:max-w-[480px] rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-lg transition-all"
            : "sm:max-w-5xl max-h-[92vh] flex flex-col rounded-xs border border-[#E3E7EB] bg-white p-6 shadow-xl transition-all overflow-hidden"
        }
      >
        <DialogHeader className="border-b border-[#E3E7EB] pb-3 shrink-0">
          <DialogTitle className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider font-mono flex items-center gap-2">
            {step === "upload" ? (
              <>
                <Upload className="w-4 h-4 text-[#1769AA]" />
                {t("title")}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-[#1769AA]" />
                {t("previewTitle")}
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-mono mt-0.5">
            {step === "upload" ? t("description") : t("previewDescription")}
          </DialogDescription>
        </DialogHeader>

        {step === "upload" ? (
          <>
            <div className="py-3 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xs border border-[#BCD5EA] bg-[#E8F2FA]/60 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#1769AA]" />
                  <span className="font-mono text-[11px] text-[#0B1F3A] font-semibold">
                    {t("excelTemplate")}
                  </span>
                </div>
                <a
                  href="/assets/templates/Edir_Registration_Template.xlsx"
                  download="Edir_Registration_Template.xlsx"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-white hover:bg-slate-50 border border-[#BCD5EA] text-[#1769AA] font-mono text-[11px] font-semibold transition-colors shadow-2xs"
                >
                  <Download className="w-3 h-3" />
                  <span>{t("downloadTemplate")}</span>
                </a>
              </div>

              <div className="rounded-xs border border-[#E3E7EB] p-2 bg-slate-50/20">
                <FileDragAndDrop
                  value={files}
                  onChange={setFiles}
                  maxFiles={1}
                  acceptedFileTypes={[
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-excel",
                  ]}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E3E7EB] shrink-0">
              <Button
                variant="outline"
                className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
                onClick={() => handleOpenChange(false)}
                disabled={isPreviewing}
              >
                {t("buttons.cancel")}
              </Button>
              <Button
                onClick={handlePreview}
                disabled={files.length === 0 || isPreviewing}
                className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5"
              >
                {isPreviewing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("buttons.previewing")}</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t("buttons.preview")}</span>
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Interactive Preview */}
            <div className="flex-1 overflow-y-auto space-y-3.5 py-3 pr-1">
              {/* Summary Scorecard */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <div className="p-2.5 rounded-xs border border-[#E3E7EB] bg-slate-50/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold truncate">
                      {t("summary.edirs")}
                    </p>
                    <p className="text-sm font-mono font-bold text-[#0B1F3A]">
                      {previewData?.summary.edirSheetTotal ?? 0}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-xs bg-[#E8F2FA] text-[#1769AA] flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xs border border-[#E3E7EB] bg-slate-50/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold truncate">
                      {t("summary.contributions")}
                    </p>
                    <p className="text-sm font-mono font-bold text-[#0B1F3A]">
                      {previewData?.summary.contributionSheetTotal ?? 0}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-xs bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xs border border-[#E3E7EB] bg-slate-50/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold truncate">
                      {t("summary.beneficiaries")}
                    </p>
                    <p className="text-sm font-mono font-bold text-[#0B1F3A]">
                      {previewData?.summary.beneficiarySheetTotal ?? 0}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-xs bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xs border border-[#E3E7EB] bg-slate-50/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold truncate">
                      {t("summary.matching")}
                    </p>
                    <div className="text-xs font-mono font-semibold truncate">
                      <span className="text-emerald-700">
                        {previewData?.summary.matchedEdirs ?? 0}
                      </span>
                      {Number(previewData?.summary.unmatchedEdirs || 0) > 0 && (
                        <span className="text-amber-600">
                          {" "}/ {previewData?.summary.unmatchedEdirs}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-xs bg-blue-50 text-[#1769AA] flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Duplicates KPI */}
                <div
                  className={`p-2.5 rounded-xs border flex items-center justify-between ${
                    (previewData?.summary.totalDuplicates ?? 0) > 0
                      ? "border-amber-300 bg-amber-50/60"
                      : "border-[#E3E7EB] bg-slate-50/60"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold truncate">
                      {t("summary.duplicates")}
                    </p>
                    <p
                      className={`text-sm font-mono font-bold ${
                        (previewData?.summary.totalDuplicates ?? 0) > 0
                          ? "text-amber-800"
                          : "text-slate-700"
                      }`}
                    >
                      {previewData?.summary.totalDuplicates ?? 0}
                    </p>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-xs flex items-center justify-center ${
                      (previewData?.summary.totalDuplicates ?? 0) > 0
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Quality Issues KPI */}
                <div
                  className={`p-2.5 rounded-xs border flex items-center justify-between ${
                    (previewData?.summary.totalIssues ?? 0) > 0
                      ? "border-amber-200 bg-amber-50/40"
                      : "border-[#E3E7EB] bg-slate-50/60"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold truncate">
                      {t("summary.issues")}
                    </p>
                    <p
                      className={`text-sm font-mono font-bold ${
                        (previewData?.summary.totalIssues ?? 0) > 0
                          ? "text-amber-800"
                          : "text-slate-700"
                      }`}
                    >
                      {previewData?.summary.totalIssues ?? 0}
                    </p>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-xs flex items-center justify-center ${
                      (previewData?.summary.totalIssues ?? 0) > 0
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Informative duplicate preservation note */}
              {(previewData?.summary.totalDuplicates ?? 0) > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xs border border-amber-200 bg-amber-50/80 text-amber-900 text-xs font-mono">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t("summary.duplicateNote")}</span>
                </div>
              )}

              {/* Sheet Tabs & Issues Filter */}
              <Tabs defaultValue="edirs" className="w-full space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <TabsList className="bg-slate-100 p-0.5 rounded-xs h-8">
                    <TabsTrigger
                      value="edirs"
                      className="text-xs font-mono font-semibold h-7 rounded-xs data-[state=active]:bg-white data-[state=active]:text-[#1769AA] gap-1.5"
                    >
                      <span>{t("tabs.edirs")}</span>
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4">
                        {previewData?.parsedEdirs.length ?? 0}
                      </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                      value="contributions"
                      className="text-xs font-mono font-semibold h-7 rounded-xs data-[state=active]:bg-white data-[state=active]:text-[#1769AA] gap-1.5"
                    >
                      <span>{t("tabs.contributions")}</span>
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4">
                        {previewData?.parsedContributions.length ?? 0}
                      </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                      value="beneficiaries"
                      className="text-xs font-mono font-semibold h-7 rounded-xs data-[state=active]:bg-white data-[state=active]:text-[#1769AA] gap-1.5"
                    >
                      <span>{t("tabs.beneficiaries")}</span>
                      <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4">
                        {previewData?.parsedBeneficiaries.length ?? 0}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  {/* Filter Toggle */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xs text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setFilterIssuesOnly(false)}
                      className={`px-2.5 py-1 rounded-xs transition-colors ${
                        !filterIssuesOnly
                          ? "bg-white text-[#0B1F3A] font-semibold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t("filter.all")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterIssuesOnly(true)}
                      className={`px-2.5 py-1 rounded-xs flex items-center gap-1.5 transition-colors ${
                        filterIssuesOnly
                          ? "bg-white text-amber-800 font-semibold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>{t("filter.issuesOnly")}</span>
                      {(previewData?.summary.totalDuplicates || 0) + (previewData?.summary.totalIssues || 0) > 0 && (
                        <Badge variant="secondary" className="px-1.5 py-0 text-[9px] h-3.5 bg-amber-100 text-amber-800 font-bold">
                          {(previewData?.summary.totalDuplicates || 0) + (previewData?.summary.totalIssues || 0)}
                        </Badge>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sheet 1: Edir Associations Table */}
                <TabsContent value="edirs" className="m-0 focus-visible:outline-none">
                  <div className="border border-[#E3E7EB] rounded-xs max-h-[340px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-[#F8FAFC] z-10 border-b border-[#E3E7EB]">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">#</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap min-w-[150px]">Status & Quality</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Association Name</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Woreda / Ketena</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Type</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Members (M / F / Tot)</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Assets (ETB)</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Chairperson</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Premises</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Permit Fee</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Additional Income</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedEdirs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={11} className="text-center py-6 text-xs text-slate-500 font-mono">
                              {filterIssuesOnly
                                ? "No duplicate records or quality issues found in Edir associations."
                                : "No Edir associations found in workbook."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          displayedEdirs.map((row: ParsedEdirRecord, idx: number) => (
                            <TableRow
                              key={idx}
                              className={`border-b border-[#E3E7EB]/70 transition-colors ${
                                row.isDuplicate
                                  ? "bg-amber-50/50 hover:bg-amber-50/80 border-l-2 border-l-amber-500"
                                  : row.issues && row.issues.length > 0
                                  ? "bg-amber-50/20 hover:bg-amber-50/50"
                                  : "hover:bg-slate-50/70"
                              }`}
                            >
                              <TableCell className="font-mono text-[11px] py-1.5 text-slate-500">{idx + 1}</TableCell>

                              {/* Status & Issues Column */}
                              <TableCell className="py-1.5 whitespace-nowrap">
                                <div className="space-y-1">
                                  {row.isDuplicate ? (
                                    <div className="space-y-0.5">
                                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-mono gap-1 font-semibold">
                                        <Copy className="w-2.5 h-2.5" />
                                        {t("badges.duplicate")}
                                      </Badge>
                                      {row.duplicateReason && (
                                        <div className="text-[10px] text-amber-800 font-mono max-w-[200px] truncate" title={row.duplicateReason}>
                                          {row.duplicateReason}
                                        </div>
                                      )}
                                    </div>
                                  ) : (!row.issues || row.issues.length === 0) ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono gap-1">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      {t("badges.clean")}
                                    </Badge>
                                  ) : null}

                                  {row.issues && row.issues.length > 0 && (
                                    <div className="space-y-0.5">
                                      {row.issues.map((issue, i) => (
                                        <div
                                          key={i}
                                          className={`flex items-center gap-1 text-[10px] font-mono ${
                                            issue.severity === "error"
                                              ? "text-rose-700"
                                              : issue.severity === "warning"
                                              ? "text-amber-800"
                                              : "text-slate-600"
                                          }`}
                                          title={issue.message}
                                        >
                                          {issue.severity === "error" ? (
                                            <AlertCircle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                                          ) : issue.severity === "warning" ? (
                                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                          ) : (
                                            <Info className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                                          )}
                                          <span className="truncate max-w-[190px]">{issue.message}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="font-semibold text-xs text-[#0B1F3A] py-1.5 whitespace-nowrap">
                                {row.name}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-600 py-1.5 whitespace-nowrap">
                                W.{row.woreda} {row.ketena ? `• K.${row.ketena}` : ""}
                              </TableCell>
                              <TableCell className="py-1.5 whitespace-nowrap">
                                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                  {row.edirType}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap">
                                {row.generalMale}M + {row.generalFemale}F ={" "}
                                <span className="font-bold text-[#0B1F3A]">
                                  {(row.generalMale || 0) + (row.generalFemale || 0)}
                                </span>
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap">
                                {formatCurrency(row.totalAssetValue)}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] py-1.5 whitespace-nowrap">
                                <div className="text-[#0B1F3A] font-medium">{row.chairpersonName || "-"}</div>
                                {row.chairpersonPhone && (
                                  <div className="text-[10px] text-slate-500">{row.chairpersonPhone}</div>
                                )}
                              </TableCell>
                              <TableCell className="py-1.5 whitespace-nowrap">
                                <Badge
                                  variant="secondary"
                                  className={`font-mono text-[10px] ${
                                    row.hasOwnPremises
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {row.hasOwnPremises ? "Own Premises" : "No"}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap">
                                {formatCurrency(row.permitFee)}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap max-w-[160px] truncate" title={row.additionalIncome || ""}>
                                {row.additionalIncome || "—"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Sheet 2: CSR Contributions Table */}
                <TabsContent value="contributions" className="m-0 focus-visible:outline-none">
                  <div className="border border-[#E3E7EB] rounded-xs max-h-[340px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-[#F8FAFC] z-10 border-b border-[#E3E7EB]">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">#</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap min-w-[150px]">Status & Quality</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Contributing Edir</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Category</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Item Description</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Monetary Value</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Target Count</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Matched Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedContributions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-xs text-slate-500 font-mono">
                              {filterIssuesOnly
                                ? "No duplicate records or quality issues found in CSR contributions."
                                : "No CSR social contributions found in workbook."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          displayedContributions.map((row: ParsedContributionRecord, idx: number) => (
                            <TableRow
                              key={idx}
                              className={`border-b border-[#E3E7EB]/70 transition-colors ${
                                row.isDuplicate
                                  ? "bg-amber-50/50 hover:bg-amber-50/80 border-l-2 border-l-amber-500"
                                  : row.issues && row.issues.length > 0
                                  ? "bg-amber-50/20 hover:bg-amber-50/50"
                                  : "hover:bg-slate-50/70"
                              }`}
                            >
                              <TableCell className="font-mono text-[11px] py-1.5 text-slate-500">{idx + 1}</TableCell>

                              {/* Status & Issues */}
                              <TableCell className="py-1.5 whitespace-nowrap">
                                <div className="space-y-1">
                                  {row.isDuplicate ? (
                                    <div className="space-y-0.5">
                                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-mono gap-1 font-semibold">
                                        <Copy className="w-2.5 h-2.5" />
                                        {t("badges.duplicate")}
                                      </Badge>
                                      {row.duplicateReason && (
                                        <div className="text-[10px] text-amber-800 font-mono max-w-[200px] truncate" title={row.duplicateReason}>
                                          {row.duplicateReason}
                                        </div>
                                      )}
                                    </div>
                                  ) : (!row.issues || row.issues.length === 0) ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono gap-1">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      {t("badges.clean")}
                                    </Badge>
                                  ) : null}

                                  {row.issues && row.issues.length > 0 && (
                                    <div className="space-y-0.5">
                                      {row.issues.map((issue, i) => (
                                        <div
                                          key={i}
                                          className={`flex items-center gap-1 text-[10px] font-mono ${
                                            issue.severity === "error"
                                              ? "text-rose-700"
                                              : issue.severity === "warning"
                                              ? "text-amber-800"
                                              : "text-slate-600"
                                          }`}
                                          title={issue.message}
                                        >
                                          {issue.severity === "error" ? (
                                            <AlertCircle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                                          ) : issue.severity === "warning" ? (
                                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                          ) : (
                                            <Info className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                                          )}
                                          <span className="truncate max-w-[190px]">{issue.message}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="font-semibold text-xs text-[#0B1F3A] py-1.5 whitespace-nowrap">
                                {row.edirNameRaw}
                              </TableCell>
                              <TableCell className="py-1.5 whitespace-nowrap">
                                <Badge variant="outline" className="font-mono text-[10px]">
                                  {row.contributionCategory}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-slate-700 py-1.5 max-w-[190px] truncate">
                                {row.itemDescription || "-"}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap">
                                {formatCurrency(row.monetaryEquivalentBirr)}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap">
                                {row.targetTotalCount || (row.targetMaleCount || 0) + (row.targetFemaleCount || 0)}
                              </TableCell>
                              <TableCell className="py-1.5 whitespace-nowrap">
                                {row.edirAssociationId ? (
                                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Matched
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 text-[10px] font-mono gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Unmatched
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Sheet 3: Beneficiaries Table */}
                <TabsContent value="beneficiaries" className="m-0 focus-visible:outline-none">
                  <div className="border border-[#E3E7EB] rounded-xs max-h-[340px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-[#F8FAFC] z-10 border-b border-[#E3E7EB]">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">#</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap min-w-[150px]">Status & Quality</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Beneficiary Name</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Sex</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Phone</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Location</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Vulnerability</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Support Details</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Value</TableHead>
                          <TableHead className="text-[11px] font-mono font-bold text-slate-700 h-8 whitespace-nowrap">Supporting Edir</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedBeneficiaries.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} className="text-center py-6 text-xs text-slate-500 font-mono">
                              {filterIssuesOnly
                                ? "No duplicate records or quality issues found in beneficiaries."
                                : "No individual beneficiaries found in workbook."}
                            </TableCell>
                          </TableRow>
                        ) : (
                          displayedBeneficiaries.map((row: ParsedBeneficiaryRecord, idx: number) => (
                            <TableRow
                              key={idx}
                              className={`border-b border-[#E3E7EB]/70 transition-colors ${
                                row.isDuplicate
                                  ? "bg-amber-50/50 hover:bg-amber-50/80 border-l-2 border-l-amber-500"
                                  : row.issues && row.issues.length > 0
                                  ? "bg-amber-50/20 hover:bg-amber-50/50"
                                  : "hover:bg-slate-50/70"
                              }`}
                            >
                              <TableCell className="font-mono text-[11px] py-1.5 text-slate-500">{idx + 1}</TableCell>

                              {/* Status & Issues */}
                              <TableCell className="py-1.5 whitespace-nowrap">
                                <div className="space-y-1">
                                  {row.isDuplicate ? (
                                    <div className="space-y-0.5">
                                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-mono gap-1 font-semibold">
                                        <Copy className="w-2.5 h-2.5" />
                                        {t("badges.duplicate")}
                                      </Badge>
                                      {row.duplicateReason && (
                                        <div className="text-[10px] text-amber-800 font-mono max-w-[200px] truncate" title={row.duplicateReason}>
                                          {row.duplicateReason}
                                        </div>
                                      )}
                                    </div>
                                  ) : (!row.issues || row.issues.length === 0) ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono gap-1">
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      {t("badges.clean")}
                                    </Badge>
                                  ) : null}

                                  {row.issues && row.issues.length > 0 && (
                                    <div className="space-y-0.5">
                                      {row.issues.map((issue, i) => (
                                        <div
                                          key={i}
                                          className={`flex items-center gap-1 text-[10px] font-mono ${
                                            issue.severity === "error"
                                              ? "text-rose-700"
                                              : issue.severity === "warning"
                                              ? "text-amber-800"
                                              : "text-slate-600"
                                          }`}
                                          title={issue.message}
                                        >
                                          {issue.severity === "error" ? (
                                            <AlertCircle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                                          ) : issue.severity === "warning" ? (
                                            <AlertTriangle className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                          ) : (
                                            <Info className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                                          )}
                                          <span className="truncate max-w-[190px]">{issue.message}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="font-semibold text-xs text-[#0B1F3A] py-1.5 whitespace-nowrap">
                                {row.beneficiaryName}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-600 py-1.5 whitespace-nowrap">
                                {row.sex || "-"}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-600 py-1.5 whitespace-nowrap">
                                {row.phoneNumber || "-"}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-600 py-1.5 whitespace-nowrap">
                                W.{row.woreda} {row.ketena ? `• K.${row.ketena}` : ""}
                              </TableCell>
                              <TableCell className="py-1.5 whitespace-nowrap">
                                <Badge variant="outline" className="font-mono text-[10px]">
                                  {row.vulnerabilityStatus || "VULNERABLE"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-slate-700 py-1.5 max-w-[190px] truncate">
                                {row.itemDetails || "-"}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap">
                                {formatCurrency(row.totalValueBirr)}
                              </TableCell>
                              <TableCell className="font-mono text-[11px] text-slate-700 py-1.5 whitespace-nowrap">
                                {row.supportingEdirNameRaw || "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Step 2 Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-[#E3E7EB] shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("upload")}
                disabled={isImporting}
                className="h-8 text-xs font-mono rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA] gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("buttons.changeFile")}</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenChange(false)}
                  disabled={isImporting}
                  className="h-8 text-xs rounded-xs border-[#E3E7EB] text-slate-700 hover:bg-[#F7F8FA]"
                >
                  {t("buttons.cancel")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleImport}
                  disabled={isImporting}
                  className="h-8 text-xs rounded-xs bg-[#1769AA] hover:bg-[#12568E] text-white font-semibold shadow-2xs gap-1.5"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t("buttons.importing")}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("buttons.import")}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
