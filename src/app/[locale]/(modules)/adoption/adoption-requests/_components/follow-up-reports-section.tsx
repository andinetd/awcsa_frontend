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

interface FollowUpReportsSectionProps {
  matchId?: number | null;
  matchStatus?: string;
  isOfficer?: boolean;
}

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  FollowUpReportStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  SUBMITTED: {
    label: "Submitted",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Eye,
  },
  REVIEWED: {
    label: "Reviewed",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  REQUIRES_ACTION: {
    label: "Requires Action",
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

const REPORT_PERIOD_PRESETS = [
  "Month 1 (1 Month Post-Placement)",
  "Month 3 (3 Months Post-Placement)",
  "Month 6 (6 Months Post-Placement)",
  "Month 9 (9 Months Post-Placement)",
  "Month 12 (1 Year Post-Placement)",
  "Month 18 (1.5 Years Post-Placement)",
  "Month 24 (2 Years Post-Placement)",
  "Annual Review (Post-2 Years)",
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

const StatusBadge = ({ status }: { status: FollowUpReportStatus }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

// ─── Report Card ───────────────────────────────────────────────────────────────

const ReportCard = ({
  report,
  isOfficer,
  onReview,
}: {
  report: FollowUpReport;
  isOfficer: boolean;
  onReview: (report: FollowUpReport) => void;
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
            <StatusBadge status={report.status} />
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
                Review
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
              label="Child Health Status"
              value={report.childHealthStatus}
            />
            <WellbeingField
              icon={Smile}
              label="Emotional Wellbeing"
              value={report.emotionalWellbeing}
            />
            <WellbeingField
              icon={BookOpen}
              label="Education Progress"
              value={report.educationProgress}
            />
            <WellbeingField
              icon={Users}
              label="Family Integration"
              value={report.familyIntegration}
            />
            {report.additionalNotes && (
              <WellbeingField
                icon={ClipboardList}
                label="Additional Notes"
                value={report.additionalNotes}
              />
            )}
          </div>

          {/* Officer review block */}
          {report.reviewedBy && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Officer Review
              </p>
              <p className="text-xs text-emerald-600 mb-2">
                Reviewed by{" "}
                <strong>
                  {report.reviewedBy.firstName} {report.reviewedBy.lastName}
                </strong>{" "}
                ({report.reviewedBy.employeeRole}) on{" "}
                {new Date(report.reviewedAt!).toLocaleDateString()}
              </p>
              {report.officerFeedback && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-emerald-700 mb-0.5">
                    Feedback:
                  </p>
                  <p className="text-sm text-slate-700">{report.officerFeedback}</p>
                </div>
              )}
              {report.officerConcerns && (
                <div className="bg-rose-50 border border-rose-200 rounded-md p-2 mt-2">
                  <p className="text-xs font-semibold text-rose-700 mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Concerns:
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
  const handleSubmitReport = () => {
    submitMutation.mutate(form, {
      onSuccess: () => {
        setIsSubmitOpen(false);
        setForm({
          reportPeriod: "",
          childHealthStatus: "",
          emotionalWellbeing: "",
          educationProgress: "",
          familyIntegration: "",
          additionalNotes: "",
        });
      },
    });
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
        Match details unavailable
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
              Follow-Up Reports
            </h3>
            <p className="text-xs text-slate-500">
              Periodic progress reports from the adoptive family
            </p>
          </div>
          {reports.length > 0 && (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
              {reports.length}
            </span>
          )}
        </div>
        {/* Submit button — visible only for client/parent, NOT officer */}
        {!isOfficer && matchStatus !== "COMPLETED" && matchStatus !== "TERMINATED" && (
          <Button
            size="sm"
            onClick={() => setIsSubmitOpen(true)}
            className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <ClipboardList className="w-3.5 h-3.5 mr-1.5" />
            Submit Report
          </Button>
        )}
      </div>

      {/* Status filter dropdown */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Filter:
          </span>
          <Select
            value={statusFilter}
            onValueChange={(val) =>
              setStatusFilter(val as FollowUpReportStatus | "ALL")
            }
          >
            <SelectTrigger className="h-8 w-52 text-xs bg-white border-slate-200">
              <SelectValue placeholder="All Statuses" />
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
                        {s === "ALL" ? "All Reports" : cfg?.label}
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
            Reset filter
          </Button>
        )}
      </div>

      {/* Report list */}
      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No follow-up reports yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            The adoptive parent can submit periodic updates here.
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
            />
          ))}
        </div>
      )}

      {/* ── Submit Report Dialog ────────────────────────────────────────── */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Follow-Up Report</DialogTitle>
            <DialogDescription>
              Provide a structured update on the child's wellbeing. All fields
              except Additional Notes are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="report-period" className="text-xs font-semibold text-slate-700 mb-1 block">
                Report Period <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={
                  REPORT_PERIOD_PRESETS.includes(form.reportPeriod)
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
                  <SelectValue placeholder="Select reporting period" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_PERIOD_PRESETS.map((period) => (
                    <SelectItem key={period} value={period} className="text-xs">
                      {period}
                    </SelectItem>
                  ))}
                  <SelectItem value="CUSTOM" className="text-xs">
                    Other / Custom Period...
                  </SelectItem>
                </SelectContent>
              </Select>
              {(!REPORT_PERIOD_PRESETS.includes(form.reportPeriod) ||
                form.reportPeriod === "") && (
                <Input
                  className="mt-2"
                  placeholder="e.g. Month 18, Mid-year update 2026..."
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
                  label: "Child Health Status",
                  icon: Heart,
                  placeholder:
                    "Describe the child's current health, any medical visits, vaccinations, or health concerns...",
                },
                {
                  key: "emotionalWellbeing",
                  label: "Emotional Wellbeing",
                  icon: Smile,
                  placeholder:
                    "Describe emotional stability, mood, behaviour, relationships with family members...",
                },
                {
                  key: "educationProgress",
                  label: "Education Progress",
                  icon: BookOpen,
                  placeholder:
                    "Describe school enrollment, attendance, grade performance, extracurricular activities...",
                },
                {
                  key: "familyIntegration",
                  label: "Family Integration",
                  icon: Users,
                  placeholder:
                    "Describe how the child is integrating with the family, siblings, community...",
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
                Additional Notes{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                placeholder="Any other relevant updates, concerns, or observations..."
                rows={2}
                value={form.additionalNotes || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, additionalNotes: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSubmitOpen(false)}
              disabled={submitMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReport}
              disabled={!isSubmitFormValid || submitMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Review Dialog ───────────────────────────────────────────────── */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Follow-Up Report</DialogTitle>
            <DialogDescription>
              Period:{" "}
              <strong>{selectedReport?.reportPeriod}</strong> — Submitted by{" "}
              {selectedReport?.submitter.firstName}{" "}
              {selectedReport?.submitter.lastName}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-2">
              {/* Read-only report summary */}
              <div className="bg-slate-50 rounded-lg p-3 space-y-0 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Submitted Report
                </p>
                <WellbeingField
                  icon={Heart}
                  label="Health"
                  value={selectedReport.childHealthStatus}
                />
                <WellbeingField
                  icon={Smile}
                  label="Emotional"
                  value={selectedReport.emotionalWellbeing}
                />
                <WellbeingField
                  icon={BookOpen}
                  label="Education"
                  value={selectedReport.educationProgress}
                />
                <WellbeingField
                  icon={Users}
                  label="Family Integration"
                  value={selectedReport.familyIntegration}
                />
                {selectedReport.additionalNotes && (
                  <WellbeingField
                    icon={ClipboardList}
                    label="Additional Notes"
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
                  Review Status
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
                    <SelectValue placeholder="Select review status" />
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
                            <span>{cfg.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700 mb-1 block">
                  Officer Feedback
                </Label>
                <Textarea
                  placeholder="Professional assessment, observations, and guidance for the adoptive family..."
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
                  Concerns{" "}
                  <span className="text-slate-400 font-normal">
                    (optional — required if status is Requires Action)
                  </span>
                </Label>
                <Textarea
                  placeholder="Flag any specific concerns that need to be addressed..."
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
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={reviewMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {reviewMutation.isPending ? "Saving..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
