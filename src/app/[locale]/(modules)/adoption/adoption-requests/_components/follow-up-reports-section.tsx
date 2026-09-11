"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Heart,
  BookOpen,
  Users,
  Smile,
  Paperclip,
  Upload,
  FileText,
  X,
  Download,
} from "lucide-react";
import {
  useListFollowUpReports,
  useSubmitFollowUpReport,
  useReviewFollowUpReport,
} from "@/hooks/adoption/useMatches";
import {
  FollowUpReport,
  FollowUpReportStatus,
  CreateFollowUpReportPayload,
  ReviewFollowUpReportPayload,
} from "@/api/adoption/matches";

export interface FollowUpAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
}

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface FollowUpReportsSectionProps {
  matchId?: number | null;
  matchStatus?: string;
  isOfficer?: boolean;
}

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  FollowUpReportStatus,
  { key: string; color: string; icon: React.ElementType }
> = {
  SUBMITTED: {
    key: "SUBMITTED",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
  },
  UNDER_REVIEW: {
    key: "UNDER_REVIEW",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Eye,
  },
  REVIEWED: {
    key: "REVIEWED",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  REQUIRES_ACTION: {
    key: "REQUIRES_ACTION",
    color: "bg-rose-100 text-rose-800 border-rose-200",
    icon: AlertTriangle,
  },
};

const FILTER_STATUSES: Array<FollowUpReportStatus | "ALL"> = [
  "ALL",
  "SUBMITTED",
  "UNDER_REVIEW",
  "REVIEWED",
  "REQUIRES_ACTION",
];

const REPORT_PERIOD_PRESETS: { key: string; fallback: string }[] = [
  { key: "month1", fallback: "Month 1 (1 Month Post-Placement)" },
  { key: "month3", fallback: "Month 3 (3 Months Post-Placement)" },
  { key: "month6", fallback: "Month 6 (6 Months Post-Placement)" },
  { key: "month9", fallback: "Month 9 (9 Months Post-Placement)" },
  { key: "month12", fallback: "Month 12 (1 Year Post-Placement)" },
  { key: "month18", fallback: "Month 18 (1.5 Years Post-Placement)" },
  { key: "month24", fallback: "Month 24 (2 Years Post-Placement)" },
  { key: "annual", fallback: "Annual Review (Post-2 Years)" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const WellbeingField = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <div className="mt-0.5 p-1.5 bg-slate-100 rounded-md shrink-0">
      <Icon className="w-3.5 h-3.5 text-slate-600" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm text-slate-800 leading-relaxed">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({
  status,
  t,
}: {
  status: FollowUpReportStatus;
  t: (key: string) => string;
}) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      <Icon className="w-3 h-3" />
      {t(`followUpReports.statuses.${cfg.key}`)}
    </span>
  );
};

// ─── Report Card ───────────────────────────────────────────────────────────────

const ReportCard = ({
  report,
  isOfficer,
  onReview,
  t,
}: {
  report: FollowUpReport;
  isOfficer: boolean;
  onReview: (report: FollowUpReport) => void;
  t: any;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between p-4 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-slate-900">
              {report.reportPeriod}
            </span>
            <StatusBadge status={report.status} t={t} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {report.submitter.firstName} {report.submitter.lastName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isOfficer &&
            (report.status === "SUBMITTED" ||
              report.status === "UNDER_REVIEW") && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 px-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => onReview(report)}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                {t("followUpReports.review")}
              </Button>
            )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-1">
          <div className="space-y-0">
            <WellbeingField
              icon={Heart}
              label={t("followUpReports.childHealthStatus")}
              value={report.childHealthStatus}
            />
            <WellbeingField
              icon={Smile}
              label={t("followUpReports.emotionalWellbeing")}
              value={report.emotionalWellbeing}
            />
            <WellbeingField
              icon={BookOpen}
              label={t("followUpReports.educationProgress")}
              value={report.educationProgress}
            />
            <WellbeingField
              icon={Users}
              label={t("followUpReports.familyIntegration")}
              value={report.familyIntegration}
            />
            {report.additionalNotes && (
              <WellbeingField
                icon={ClipboardList}
                label={t("followUpReports.additionalNotes")}
                value={report.additionalNotes}
              />
            )}
            {report.attachments &&
              Array.isArray(report.attachments) &&
              report.attachments.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                    {t("followUpReports.attachedFiles")} ({report.attachments.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {report.attachments.map((att: any, idx: number) => {
                      const isImg =
                        att.fileType && att.fileType.startsWith("image/");
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                            {isImg ? (
                              <img
                                src={att.fileUrl}
                                alt={att.fileName || "attachment"}
                                className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p
                                className="font-medium text-slate-800 truncate"
                                title={att.fileName}
                              >
                                {att.fileName || `Attachment #${idx + 1}`}
                              </p>
                              {att.fileSize && (
                                <p className="text-[10px] text-slate-400">
                                  {formatFileSize(att.fileSize)}
                                </p>
                              )}
                            </div>
                          </div>
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={att.fileName || `attachment-${idx + 1}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded text-[11px] font-medium text-slate-600 transition-colors shrink-0"
                          >
                            <Download className="w-3 h-3" />
                            {t("followUpReports.view")}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>

          {/* Officer review block */}
          {report.reviewedBy && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t("followUpReports.officerReview")}
              </p>
              <p className="text-xs text-emerald-600 mb-2">
                {t("followUpReports.reviewedBy")}{" "}
                <strong>
                  {report.reviewedBy.firstName} {report.reviewedBy.lastName}
                </strong>{" "}
                ({report.reviewedBy.employeeRole}) {t("followUpReports.on")}{" "}
                {new Date(report.reviewedAt!).toLocaleDateString()}
              </p>
              {report.officerFeedback && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-emerald-700 mb-0.5">
                    {t("followUpReports.feedbackLabel")}
                  </p>
                  <p className="text-sm text-slate-700">{report.officerFeedback}</p>
                </div>
              )}
              {report.officerConcerns && (
                <div className="bg-rose-50 border border-rose-200 rounded-md p-2 mt-2">
                  <p className="text-xs font-semibold text-rose-700 mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {t("followUpReports.concernsLabel")}
                  </p>
                  <p className="text-sm text-rose-800">{report.officerConcerns}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

export const FollowUpReportsSection: React.FC<FollowUpReportsSectionProps> = ({
  matchId,
  matchStatus,
  isOfficer = false,
}) => {
  const t = useTranslations("adoption");

  // Filter state
  const [statusFilter, setStatusFilter] = useState<
    FollowUpReportStatus | "ALL"
  >("ALL");

  // Dialog state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FollowUpReport | null>(
    null
  );

  // Submit form state
  const [form, setForm] = useState<CreateFollowUpReportPayload>({
    reportPeriod: "",
    childHealthStatus: "",
    emotionalWellbeing: "",
    educationProgress: "",
    familyIntegration: "",
    additionalNotes: "",
  });

  const [attachments, setAttachments] = useState<FollowUpAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState<ReviewFollowUpReportPayload>({
    status: "REVIEWED",
    officerFeedback: "",
    officerConcerns: "",
  });

  // Data
  const { data: reports = [], isLoading } = useListFollowUpReports(
    matchId,
    statusFilter === "ALL" ? undefined : statusFilter
  );

  const submitMutation = useSubmitFollowUpReport(matchId);
  const reviewMutation = useReviewFollowUpReport(matchId);

  // Handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newAttachments: FollowUpAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          fileName: file.name,
          fileUrl: dataUrl,
          fileType: file.type || "application/octet-stream",
          fileSize: file.size,
        });
      }

      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      console.error("Error reading attached file:", err);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReport = () => {
    submitMutation.mutate(
      {
        ...form,
        attachments: attachments.length > 0 ? attachments : undefined,
      },
      {
        onSuccess: () => {
          setIsSubmitOpen(false);
          setAttachments([]);
          setForm({
            reportPeriod: "",
            childHealthStatus: "",
            emotionalWellbeing: "",
            educationProgress: "",
            familyIntegration: "",
            additionalNotes: "",
          });
        },
      }
    );
  };

  const handleOpenReview = (report: FollowUpReport) => {
    setSelectedReport(report);
    setReviewForm({
      status: "REVIEWED",
      officerFeedback: report.officerFeedback || "",
      officerConcerns: report.officerConcerns || "",
    });
    setIsReviewOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedReport) return;
    reviewMutation.mutate(
      { reportId: selectedReport.id, payload: reviewForm },
      {
        onSuccess: () => {
          setIsReviewOpen(false);
          setSelectedReport(null);
        },
      }
    );
  };

  const isSubmitFormValid =
    form.reportPeriod.trim() &&
    form.childHealthStatus.trim() &&
    form.emotionalWellbeing.trim() &&
    form.educationProgress.trim() &&
    form.familyIntegration.trim();

  if (!matchId) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
        {t("followUpReports.matchDetailsUnavailable")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <ClipboardList className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t("followUpReports.title")}
            </h3>
            <p className="text-xs text-slate-500">
              {t("followUpReports.subtitle")}
            </p>
          </div>
          {reports.length > 0 && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
              {reports.length}
            </span>
          )}
        </div>
        {/* Submit button — visible only for client/parent, NOT officer */}
        {!isOfficer && matchStatus !== "TERMINATED" && (
          <Button
            size="sm"
            onClick={() => setIsSubmitOpen(true)}
            className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
            {t("followUpReports.submitReport")}
          </Button>
        )}
      </div>

      {/* Status filter dropdown */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {t("followUpReports.filterLabel")}
          </span>
          <Select
            value={statusFilter}
            onValueChange={(val) =>
              setStatusFilter(val as FollowUpReportStatus | "ALL")
            }
          >
            <SelectTrigger className="h-8 w-52 text-xs bg-white border-slate-200">
              <SelectValue placeholder={t("followUpReports.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              {FILTER_STATUSES.map((s) => {
                const cfg =
                  s === "ALL" ? null : STATUS_CONFIG[s as FollowUpReportStatus];
                const Icon = cfg?.icon;
                return (
                  <SelectItem key={s} value={s} className="text-xs">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
                      <span>
                        {s === "ALL" ? t("followUpReports.allReports") : t(`followUpReports.statuses.${cfg?.key}`)}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {statusFilter !== "ALL" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatusFilter("ALL")}
            className="h-7 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            {t("followUpReports.resetFilter")}
          </Button>
        )}
      </div>

      {/* Report list */}
      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          {t("followUpReports.loadingReports")}
        </div>
      ) : reports.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">{t("followUpReports.noReports")}</p>
          <p className="text-xs text-slate-400 mt-1">
            {t("followUpReports.noReportsSubtitle")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isOfficer={isOfficer}
              onReview={handleOpenReview}
              t={t}
            />
          ))}
        </div>
      )}

      {/* ── Submit Report Dialog ────────────────────────────────────────── */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("followUpReports.submitTitle")}</DialogTitle>
            <DialogDescription>
              {t("followUpReports.submitDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="report-period" className="text-xs font-semibold text-slate-700 mb-1 block">
                {t("followUpReports.reportPeriod")} <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={
                  REPORT_PERIOD_PRESETS.some(
                    (p) =>
                      p.fallback === form.reportPeriod ||
                      t(`followUpReports.presets.${p.key}`) === form.reportPeriod
                  )
                    ? form.reportPeriod
                    : form.reportPeriod
                    ? "CUSTOM"
                    : undefined
                }
                onValueChange={(val) => {
                  if (val === "CUSTOM") {
                    setForm((f) => ({ ...f, reportPeriod: "" }));
                  } else {
                    setForm((f) => ({ ...f, reportPeriod: val }));
                  }
                }}
              >
                <SelectTrigger
                  id="report-period"
                  className="w-full bg-white border-slate-300 h-9 text-sm"
                >
                  <SelectValue placeholder={t("followUpReports.selectPeriod")} />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_PERIOD_PRESETS.map((preset) => {
                    const label = t(`followUpReports.presets.${preset.key}`);
                    return (
                      <SelectItem key={preset.key} value={label} className="text-xs">
                        {label}
                      </SelectItem>
                    );
                  })}
                  <SelectItem value="CUSTOM" className="text-xs">
                    {t("followUpReports.customPeriod")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {(!REPORT_PERIOD_PRESETS.some(
                (p) =>
                  p.fallback === form.reportPeriod ||
                  t(`followUpReports.presets.${p.key}`) === form.reportPeriod
              ) ||
                form.reportPeriod === "") && (
                <Input
                  className="mt-2"
                  placeholder={t("followUpReports.customPeriodPlaceholder")}
                  value={form.reportPeriod}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reportPeriod: e.target.value }))
                  }
                />
              )}
            </div>

            {(
              [
                {
                  key: "childHealthStatus",
                  label: t("followUpReports.childHealthStatus"),
                  icon: Heart,
                  placeholder: t("followUpReports.childHealthPlaceholder"),
                },
                {
                  key: "emotionalWellbeing",
                  label: t("followUpReports.emotionalWellbeing"),
                  icon: Smile,
                  placeholder: t("followUpReports.emotionalPlaceholder"),
                },
                {
                  key: "educationProgress",
                  label: t("followUpReports.educationProgress"),
                  icon: BookOpen,
                  placeholder: t("followUpReports.educationPlaceholder"),
                },
                {
                  key: "familyIntegration",
                  label: t("followUpReports.familyIntegration"),
                  icon: Users,
                  placeholder: t("followUpReports.familyPlaceholder"),
                },
              ] as {
                key: keyof CreateFollowUpReportPayload;
                label: string;
                icon: React.ElementType;
                placeholder: string;
              }[]
            ).map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {label} <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  placeholder={placeholder}
                  rows={3}
                  value={(form[key] as string) || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                {t("followUpReports.additionalNotes")}{" "}
                <span className="text-slate-400 font-normal">
                  ({t("followUpReports.optional")})
                </span>
              </Label>
              <Textarea
                placeholder={t("followUpReports.additionalNotesPlaceholder")}
                rows={2}
                value={form.additionalNotes || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, additionalNotes: e.target.value }))
                }
              />
            </div>

            {/* Additional Files / Attachments */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  {t("followUpReports.attachAdditionalFiles")}
                  <span className="text-slate-400 font-normal">
                    {t("followUpReports.attachFilesDesc")}
                  </span>
                </Label>
                {attachments.length > 0 && (
                  <span className="text-xs text-indigo-600 font-medium">
                    {t("followUpReports.filesSelected", {
                      count: attachments.length,
                    })}
                  </span>
                )}
              </div>

              {/* Upload trigger button / dropzone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors rounded-xl p-4 text-center bg-slate-50/60 hover:bg-indigo-50/20 cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <p className="text-xs font-medium text-slate-700">
                    {isUploading
                      ? t("followUpReports.readingFiles")
                      : t("followUpReports.dragOrClick")}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t("followUpReports.supportedFormats")}
                  </p>
                </div>
              </div>

              {/* File preview list */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2 max-h-44 overflow-y-auto pr-1">
                  {attachments.map((att, idx) => {
                    const isImg = att.fileType.startsWith("image/");
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                          {isImg ? (
                            <img
                              src={att.fileUrl}
                              alt={att.fileName}
                              className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 truncate">
                              {att.fileName}
                            </p>
                            {att.fileSize && (
                              <p className="text-[10px] text-slate-400">
                                {formatFileSize(att.fileSize)}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title={t("followUpReports.removeFile")}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmitOpen(false)}
              disabled={submitMutation.isPending}
            >
              {t("followUpReports.actions.cancel")}
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!isSubmitFormValid || submitMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {submitMutation.isPending
                ? t("followUpReports.actions.submitting")
                : t("followUpReports.actions.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Review Dialog ───────────────────────────────────────────────── */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("followUpReports.reviewTitle")}</DialogTitle>
            <DialogDescription>
              {t("followUpReports.periodLabel")}{" "}
              <strong>{selectedReport?.reportPeriod}</strong> —{" "}
              {t("followUpReports.submittedBy")}{" "}
              {selectedReport?.submitter.firstName}{" "}
              {selectedReport?.submitter.lastName}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-2">
              {/* Read-only report summary */}
              <div className="bg-slate-50 rounded-lg p-3 space-y-0 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  {t("followUpReports.submittedReport")}
                </p>
                <WellbeingField
                  icon={Heart}
                  label={t("followUpReports.childHealthStatus")}
                  value={selectedReport.childHealthStatus}
                />
                <WellbeingField
                  icon={Smile}
                  label={t("followUpReports.emotionalWellbeing")}
                  value={selectedReport.emotionalWellbeing}
                />
                <WellbeingField
                  icon={BookOpen}
                  label={t("followUpReports.educationProgress")}
                  value={selectedReport.educationProgress}
                />
                <WellbeingField
                  icon={Users}
                  label={t("followUpReports.familyIntegration")}
                  value={selectedReport.familyIntegration}
                />
                {selectedReport.additionalNotes && (
                  <WellbeingField
                    icon={ClipboardList}
                    label={t("followUpReports.additionalNotes")}
                    value={selectedReport.additionalNotes}
                  />
                )}
              </div>

              {/* Officer review fields */}
              <div>
                <Label
                  htmlFor="review-status"
                  className="text-xs font-semibold text-slate-700 mb-1.5 block"
                >
                  {t("followUpReports.reviewStatus")}
                </Label>
                <Select
                  value={reviewForm.status}
                  onValueChange={(val) =>
                    setReviewForm((f) => ({
                      ...f,
                      status: val as FollowUpReportStatus,
                    }))
                  }
                >
                  <SelectTrigger
                    id="review-status"
                    className="w-full bg-white border-slate-300 h-9 text-sm"
                  >
                    <SelectValue placeholder={t("followUpReports.selectReviewStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "UNDER_REVIEW",
                        "REVIEWED",
                        "REQUIRES_ACTION",
                      ] as FollowUpReportStatus[]
                    ).map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const Icon = cfg.icon;
                      return (
                        <SelectItem key={s} value={s} className="text-xs">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-slate-500" />
                            <span>{t(`followUpReports.statuses.${cfg.key}`)}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("followUpReports.officerFeedback")}
                </Label>
                <Textarea
                  placeholder={t("followUpReports.officerFeedbackPlaceholder")}
                  rows={3}
                  value={reviewForm.officerFeedback || ""}
                  onChange={(e) =>
                    setReviewForm((f) => ({
                      ...f,
                      officerFeedback: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  {t("followUpReports.officerConcerns")}{" "}
                  <span className="text-slate-400 font-normal">
                    {t("followUpReports.concernsHint")}
                  </span>
                </Label>
                <Textarea
                  placeholder={t("followUpReports.officerConcernsPlaceholder")}
                  rows={2}
                  value={reviewForm.officerConcerns || ""}
                  onChange={(e) =>
                    setReviewForm((f) => ({
                      ...f,
                      officerConcerns: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewOpen(false)}
              disabled={reviewMutation.isPending}
            >
              {t("followUpReports.actions.cancel")}
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={reviewMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {reviewMutation.isPending
                ? t("followUpReports.actions.savingReview")
                : t("followUpReports.actions.saveReview")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
